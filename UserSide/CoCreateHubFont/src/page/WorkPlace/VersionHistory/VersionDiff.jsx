import React, { useState, useEffect } from 'react';
import { Modal, Spin, message } from 'antd';
import { compareVersionsApi } from '../../api/version';
import './VersionDiff.css';

const VersionDiff = ({ visible, fromVersion, toVersion, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [diffResult, setDiffResult] = useState(null);

    // 加载版本比较结果
    useEffect(() => {
        if (visible && fromVersion && toVersion) {
            loadVersionDiff();
        }
    }, [visible, fromVersion, toVersion]);

    const loadVersionDiff = async () => {
        if (!fromVersion || !toVersion) return;

        setLoading(true);
        try {
            const response = await compareVersionsApi(fromVersion.vid, toVersion.vid);
            setDiffResult(response.data);
        } catch (error) {
            console.error('版本比较失败:', error);
            message.error('版本比较失败');
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
            title="版本比较"
            open={visible}
            onCancel={onClose}
            width={1400}
            className="version-diff-modal"
            footer={null}
        >
            {loading ? (
                <div className="diff-loading">
                    <Spin size="large" />
                    <p>比较版本中...</p>
                </div>
            ) : diffResult ? (
                <div className="version-diff-container">
                    {/* 版本信息对比 */}
                    <div className="diff-header">
                        <div className="version-info from-version">
                            <h4>版本 #{diffResult.fromVersion.vid}</h4>
                            <p>编辑者: {diffResult.fromVersion.editor}</p>
                            <p>时间: {formatTime(diffResult.fromVersion.createtime)}</p>
                        </div>
                        <div className="diff-arrow">→</div>
                        <div className="version-info to-version">
                            <h4>版本 #{diffResult.toVersion.vid}</h4>
                            <p>编辑者: {diffResult.toVersion.editor}</p>
                            <p>时间: {formatTime(diffResult.toVersion.createtime)}</p>
                        </div>
                    </div>

                    {/* 差异统计 */}
                    {diffResult.stats && (
                        <div className="diff-stats">
                            <div className="stat-item additions">
                                <span className="stat-number">+{diffResult.stats.additions}</span>
                                <span className="stat-label">新增</span>
                            </div>
                            <div className="stat-item deletions">
                                <span className="stat-number">-{diffResult.stats.deletions}</span>
                                <span className="stat-label">删除</span>
                            </div>
                            <div className="stat-item modifications">
                                <span className="stat-number">~{diffResult.stats.modifications}</span>
                                <span className="stat-label">修改</span>
                            </div>
                        </div>
                    )}

                    {/* 差异内容 */}
                    <div className="diff-content">
                        {diffResult.diffBlocks && diffResult.diffBlocks.length > 0 ? (
                            <div className="diff-blocks">
                                {diffResult.diffBlocks.map((block, index) => (
                                    <div
                                        key={index}
                                        className={`diff-block ${block.type}`}
                                    >
                                        <div className="line-number">{block.lineNumber}</div>
                                        <div className="block-content">{block.content}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-diff">
                                <p>两个版本内容相同</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="diff-error">
                    <p>无法比较版本</p>
                </div>
            )}
        </Modal>
    );
};

export default VersionDiff;