import React, { useState, useCallback, useEffect } from 'react';
import { Modal, message, Spin } from 'antd';
import * as Y from 'yjs';
import VersionTimeline from './VersionTimeline';
import VersionDiff from './VersionDiff';
import ReadOnlyEditor from './ReadOnlyEditor';
import { getVersionsApi, getVersionContentApi } from '../../api/version';
import './VersionHistory.css';

// Base64 转 Uint8Array 工具函数
const base64ToUint8Array = (base64) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

// 从 Yjs 二进制数据中提取内容
const parseVersionContent = (base64Content, docId) => {
    try {
        console.log('开始解析版本内容，docId:', docId);

        // 解码 Base64
        const update = base64ToUint8Array(base64Content);
        console.log('Base64 解码完成，字节数:', update.length);

        // 创建临时 Yjs 文档
        const yDoc = new Y.Doc();
        Y.applyUpdate(yDoc, update);

        // 获取共享类型 - 使用 Y.XmlText
        const sharedType = yDoc.get(docId, Y.XmlText);
        console.log('Yjs 文档长度:', sharedType.length);

        // 从 Y.XmlText 中提取 Slate 内容
        // Y.XmlText 存储的是 JSON 字符串格式的 Slate 内容
        const textContent = sharedType.toString();
        console.log('提取的文本内容长度:', textContent.length);
        console.log('内容预览:', textContent.substring(0, 200));

        // 清理
        yDoc.destroy();

        // 尝试解析为 JSON（Slate 格式）
        if (textContent && textContent.trim()) {
            try {
                const parsed = JSON.parse(textContent);
                if (Array.isArray(parsed)) {
                    console.log('成功解析为 Slate 格式，节点数:', parsed.length);
                    return JSON.stringify(parsed);
                }
            } catch (e) {
                console.log('不是 JSON 格式，作为纯文本处理');
                // 不是 JSON，返回纯文本格式
                return JSON.stringify([{
                    type: 'paragraph',
                    children: [{ text: textContent }]
                }]);
            }
        }

        // 如果没有内容，返回空段落
        console.log('没有内容，返回空段落');
        return JSON.stringify([{
            type: 'paragraph',
            children: [{ text: '' }]
        }]);

    } catch (error) {
        console.error('解析版本内容失败:', error);
        console.error('错误堆栈:', error.stack);
        return JSON.stringify([{
            type: 'paragraph',
            children: [{ text: '内容解析失败: ' + error.message }]
        }]);
    }
};

const VersionHistory = ({ docid, visible, onClose }) => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVersions, setSelectedVersions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 预览状态
    const [previewVersion, setPreviewVersion] = useState(null);
    const [previewContent, setPreviewContent] = useState('');
    const [loadingContent, setLoadingContent] = useState(false);

    // 比较状态
    const [diffVisible, setDiffVisible] = useState(false);
    const [diffVersions, setDiffVersions] = useState({ from: null, to: null });

    // 加载版本列表
    const loadVersions = useCallback(async (page = 1, reset = false) => {
        setLoading(true);
        try {
            const response = await getVersionsApi(docid, page, 20, searchTerm);
            const { records, pages } = response.data;

            if (reset || page === 1) {
                setVersions(records);
                setCurrentPage(1);
                // 自动选择第一个版本进行预览
                if (records && records.length > 0) {
                    handlePreview(records[0]);
                }
            } else {
                setVersions(prev => [...prev, ...records]);
                setCurrentPage(page);
            }

            setTotalPages(pages);
            setHasMore(page < pages);

        } catch (error) {
            console.error('加载版本历史失败:', error);
            message.error('加载版本历史失败');
        } finally {
            setLoading(false);
        }
    }, [docid, searchTerm]);

    // 加载版本内容
    const loadVersionContent = useCallback(async (vid) => {
        setLoadingContent(true);
        try {
            const response = await getVersionContentApi(vid);
            const base64Content = response.data;

            // 解析版本内容（支持多种格式）
            const slateContent = parseVersionContent(base64Content, docid);
            setPreviewContent(slateContent);
        } catch (error) {
            console.error('加载版本内容失败:', error);
            message.error('加载版本内容失败');
            setPreviewContent(JSON.stringify([{ type: 'paragraph', children: [{ text: '加载失败' }] }]));
        } finally {
            setLoadingContent(false);
        }
    }, [docid]);

    // 搜索处理
    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        setSelectedVersions([]);
    }, []);

    // 搜索词变化时重新加载
    useEffect(() => {
        if (visible && docid && searchTerm !== '') {
            loadVersions(1, true);
        }
    }, [searchTerm, visible, docid, loadVersions]);

    // 加载更多
    const handleLoadMore = useCallback(() => {
        if (hasMore && !loading) {
            loadVersions(currentPage + 1);
        }
    }, [hasMore, loading, currentPage, loadVersions]);

    // 版本选择处理
    const handleVersionSelect = useCallback((vid) => {
        setSelectedVersions(prev => {
            if (prev.includes(vid)) {
                return prev.filter(id => id !== vid);
            } else if (prev.length < 2) {
                return [...prev, vid];
            } else {
                // 最多选择2个版本用于比较
                return [prev[1], vid];
            }
        });
    }, []);

    // 版本预览
    const handlePreview = useCallback((version) => {
        setPreviewVersion(version);
        loadVersionContent(version.vid);
    }, [loadVersionContent]);

    // 版本比较
    const handleCompare = useCallback(() => {
        if (selectedVersions.length === 2) {
            const fromVersion = versions.find(v => v.vid === selectedVersions[0]);
            const toVersion = versions.find(v => v.vid === selectedVersions[1]);
            setDiffVersions({ from: fromVersion, to: toVersion });
            setDiffVisible(true);
        } else {
            message.warning('请选择两个版本进行比较');
        }
    }, [selectedVersions, versions]);

    // 版本操作成功后刷新列表
    const handleVersionAction = useCallback(() => {
        if (visible && docid) {
            loadVersions(1, true);
        }
        setSelectedVersions([]);
    }, [visible, docid, loadVersions]);

    // 初始加载 - 只在打开时加载一次
    useEffect(() => {
        if (visible && docid) {
            setVersions([]);
            setSelectedVersions([]);
            setSearchTerm('');
            setCurrentPage(1);
            setPreviewVersion(null);
            setPreviewContent('');
            loadVersions(1, true);
        }
    }, [visible, docid]); // 只依赖 visible 和 docid

    // 重置状态
    const handleClose = useCallback(() => {
        setVersions([]);
        setSelectedVersions([]);
        setSearchTerm('');
        setCurrentPage(1);
        setPreviewVersion(null);
        setPreviewContent('');
        setDiffVisible(false);
        onClose();
    }, [onClose]);

    return (
        <>
            <Modal
                title="历史版本比较"
                open={visible}
                onCancel={handleClose}
                width={900}
                centered
                className="version-history-modal"
                footer={null}
                destroyOnClose
            >
                <div className="version-history-container">
                    <div className="version-history-layout">
                        {/* 左侧：版本内容预览 */}
                        <div className="version-preview-panel">
                            <div className="preview-header">
                                <h3>版本预览</h3>
                                {previewVersion && (
                                    <div className="preview-info">
                                        <span className="preview-version-id">{previewVersion.vid}</span>
                                        <span className="preview-time">
                                            {new Date(previewVersion.createdAt).toLocaleString('zh-CN')}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="preview-content">
                                <ReadOnlyEditor
                                    content={previewContent}
                                    loading={loadingContent}
                                />
                            </div>
                        </div>

                        {/* 右侧：版本列表 */}
                        <div className="version-list-panel">
                            <div className="version-list-header">
                                <h3>历史版本</h3>
                            </div>

                            {/* 版本时间线 */}
                            <div className="version-timeline-container">
                                <VersionTimeline
                                    versions={versions}
                                    loading={loading}
                                    selectedVersions={selectedVersions}
                                    currentPreviewVid={previewVersion?.vid}
                                    onVersionSelect={handleVersionSelect}
                                    onLoadMore={handleLoadMore}
                                    onPreview={handlePreview}
                                    onVersionAction={handleVersionAction}
                                    hasMore={hasMore}
                                />

                                {loading && versions.length === 0 && (
                                    <div className="loading-container">
                                        <Spin size="large" />
                                        <p>加载版本历史中...</p>
                                    </div>
                                )}

                                {!loading && versions.length === 0 && (
                                    <div className="empty-container">
                                        <p>暂无版本历史</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* 版本比较模态框 */}
            <VersionDiff
                visible={diffVisible}
                fromVersion={diffVersions.from}
                toVersion={diffVersions.to}
                onClose={() => setDiffVisible(false)}
            />
        </>
    );
};

export default VersionHistory;