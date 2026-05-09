import React, { useState, useEffect } from 'react';
import { Modal, Spin, message } from 'antd';
import { getVersionContentApi } from '../../api/version';
import './VersionPreview.css';

const VersionPreview = ({ visible, version, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(null);

    // 加载版本内容
    useEffect(() => {
        if (visible && version) {
            loadVersionContent();
        }
    }, [visible, version]);

    const loadVersionContent = async () => {
        if (!version) return;

        setLoading(true);
        try {
            const response = await getVersionContentApi(version.vid);
            setContent(response.data);
        } catch (error) {
            console.error('加载版本内容失败:', error);
            message.error('加载版本内容失败');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleString('zh-CN');
    };

    return (
        <Modal
            title="版本预览"
            open={visible}
            onCancel={onClose}
            width={1000}
            className="version-preview-modal"
            footer={null}
        >
            {loading ? (
                <div className="preview-loading">
                    <Spin size="large" />
                    <p>加载版本内容中...</p>
                </div>
            ) : content ? (
                <div className="version-preview-container">
                    {/* 版本信息头部 */}
                    <div className="preview-header">
                        <div className="version-metadata">
                            <h3>版本 #{content.vid}</h3>
                            <div className="metadata-row">
                                <span>编辑者：{content.editor}</span>
                                <span>时间：{formatTime(content.createtime)}</span>
                                <span>类型：{content.snapshotType === 'auto_milestone' ? '自动里程碑' : '自动保存'}</span>
                            </div>
                            {content.labels && content.labels.length > 0 && (
                                <div className="metadata-labels">
                                    标签：{content.labels.join(', ')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 内容预览区域 */}
                    <div className="preview-content">
                        <div className="content-viewer">
                            {/* 这里应该渲染 Yjs 内容为可读格式 */}
                            {/* 暂时显示原始内容信息 */}
                            <div className="content-placeholder">
                                <p>版本内容预览</p>
                                <p>文档ID: {content.docid}</p>
                                <p>内容大小: {content.content ? content.content.length : 0} 字节</p>
                                {/* TODO: 实现 Yjs 内容渲染 */}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="preview-error">
                    <p>无法加载版本内容</p>
                </div>
            )}
        </Modal>
    );
};

export default VersionPreview;