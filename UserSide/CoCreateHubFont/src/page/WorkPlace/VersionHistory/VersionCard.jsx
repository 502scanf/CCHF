import React, { useState, useCallback } from 'react';
import { Checkbox, Tag, Dropdown, Modal, Input, message } from 'antd';
import {
    MoreOutlined,
    EyeOutlined,
    RollbackOutlined,
    TagOutlined,
    LockOutlined,
    UnlockOutlined,
    DownloadOutlined,
    ClockCircleOutlined,
    FlagOutlined  // 使用 FlagOutlined 替代 MilestoneOutlined
} from '@ant-design/icons';
import {
    restoreVersionApi,
    updateVersionLabelApi,
    toggleVersionLockApi,
    exportVersionApi
} from '../../api/version';
import './VersionCard.css';

const VersionCard = ({
    version,
    index,
    isSelected,
    isPreviewing,
    onSelect,
    onPreview,
    onVersionAction,
    showConnector,
    formatTime
}) => {
    const [labelModalVisible, setLabelModalVisible] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // 获取快照类型图标
    const getSnapshotTypeIcon = useCallback((type) => {
        switch (type) {
            case 'auto_milestone':
                return <FlagOutlined className="milestone-icon" />;  // 使用 FlagOutlined 替代 MilestoneOutlined
            default:
                return <ClockCircleOutlined className="auto-icon" />;
        }
    }, []);

    // 获取快照类型文本
    const getSnapshotTypeText = useCallback((type) => {
        switch (type) {
            case 'auto_milestone':
                return '自动里程碑';
            default:
                return '自动保存';
        }
    }, []);

    // 处理版本恢复
    const handleRestore = useCallback(async () => {
        Modal.confirm({
            title: '确认恢复版本',
            content: `确定要恢复到此版本吗？当前内容将被替换。`,
            okText: '确认恢复',
            cancelText: '取消',
            okButtonProps: { danger: true },
            onOk: async () => {
                try {
                    setActionLoading(true);
                    console.log('========== 开始恢复版本 ==========');
                    console.log('版本信息:', {
                        docid: version.docid,
                        vid: version.vid,
                        snapshotType: version.snapshotType
                    });

                    console.log('步骤1: 调用恢复 API...');
                    const response = await restoreVersionApi(version.docid, version.vid, '用户手动恢复');
                    console.log('API 响应:', response);

                    // 关闭版本历史窗口
                    onVersionAction();

                    message.success('版本恢复成功！页面将自动刷新...', 1.5);

                    // 刷新页面，让编辑器从数据库重新初始化
                    // 这是最可靠的方式，因为 Slate-Yjs 的绑定关系需要重新建立
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } catch (error) {
                    console.error('========== 版本恢复失败 ==========');
                    console.error('错误详情:', error);
                    console.error('错误响应:', error.response);
                    message.error(`版本恢复失败: ${error.response?.data?.msg || error.message}`);
                } finally {
                    setActionLoading(false);
                }
            }
        });
    }, [version, onVersionAction]);

    // 处理添加标签
    const handleAddLabel = useCallback(async () => {
        if (!newLabel.trim()) {
            message.warning('请输入标签内容');
            return;
        }

        try {
            setActionLoading(true);
            await updateVersionLabelApi(version.vid, 'add', newLabel.trim());
            message.success('标签添加成功');
            setNewLabel('');
            setLabelModalVisible(false);
            onVersionAction();
        } catch (error) {
            console.error('添加标签失败:', error);
            message.error('添加标签失败');
        } finally {
            setActionLoading(false);
        }
    }, [version.vid, newLabel, onVersionAction]);

    // 处理删除标签
    const handleDeleteLabel = useCallback(async (labelIndex) => {
        try {
            setActionLoading(true);
            await updateVersionLabelApi(version.vid, 'delete', '', labelIndex);
            message.success('标签删除成功');
            onVersionAction();
        } catch (error) {
            console.error('删除标签失败:', error);
            message.error('删除标签失败');
        } finally {
            setActionLoading(false);
        }
    }, [version.vid, onVersionAction]);

    // 处理锁定切换
    const handleToggleLock = useCallback(async () => {
        try {
            setActionLoading(true);
            await toggleVersionLockApi(version.vid);
            const action = version.isLocked ? '解锁' : '锁定';
            message.success(`版本${action}成功`);
            onVersionAction();
        } catch (error) {
            console.error('锁定切换失败:', error);
            message.error('锁定切换失败');
        } finally {
            setActionLoading(false);
        }
    }, [version.vid, version.isLocked, onVersionAction]);

    // 处理导出
    const handleExport = useCallback(async (format) => {
        try {
            setActionLoading(true);
            const response = await exportVersionApi(version.vid, format);

            // 创建下载链接
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `version_${version.vid}_${Date.now()}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            message.success('导出成功');
        } catch (error) {
            console.error('导出失败:', error);
            message.error('导出失败');
        } finally {
            setActionLoading(false);
        }
    }, [version.vid]);

    // 菜单项
    const menuItems = [
        {
            key: 'preview',
            label: '预览',
            icon: <EyeOutlined />,
            onClick: onPreview
        },
        {
            key: 'restore',
            label: '恢复',
            icon: <RollbackOutlined />,
            onClick: handleRestore,
            disabled: actionLoading
        },
        {
            key: 'label',
            label: '添加标签',
            icon: <TagOutlined />,
            onClick: () => setLabelModalVisible(true)
        },
        {
            key: 'lock',
            label: version.isLocked ? '解锁' : '锁定',
            icon: version.isLocked ? <UnlockOutlined /> : <LockOutlined />,
            onClick: handleToggleLock,
            disabled: actionLoading
        },
        {
            key: 'export',
            label: '导出',
            icon: <DownloadOutlined />,
            children: [
                {
                    key: 'export-txt',
                    label: '导出为 TXT',
                    onClick: () => handleExport('txt')
                },
                {
                    key: 'export-md',
                    label: '导出为 Markdown',
                    onClick: () => handleExport('md')
                }
            ]
        }
    ];

    return (
        <>
            <div
                className={`version-card ${isSelected ? 'selected' : ''} ${isPreviewing ? 'previewing' : ''} ${version.snapshotType === 'auto_milestone' ? 'milestone' : ''}`}
                style={{ '--index': index }}
            >
                {/* 时间线节点 */}
                <div className="timeline-node">
                    {getSnapshotTypeIcon(version.snapshotType)}
                </div>

                {/* 卡片内容 */}
                <div className="version-card-content">
                    <div className="version-card-header">
                        <Checkbox
                            checked={isSelected}
                            onChange={onSelect}
                            className="version-checkbox"
                        />

                        <div className="version-info">
                            <div className="version-meta">
                                <span className="editor-name">{version.editor}</span>
                                <span className="version-time">{formatTime(version.createtime)}</span>
                                <span className="snapshot-type">{getSnapshotTypeText(version.snapshotType)}</span>
                                {version.isLocked && <LockOutlined className="lock-icon" />}
                            </div>

                            {version.labels && version.labels.length > 0 && (
                                <div className="version-labels">
                                    {version.labels.map((label, labelIndex) => (
                                        <Tag
                                            key={labelIndex}
                                            color="blue"
                                            closable
                                            onClose={() => handleDeleteLabel(labelIndex)}
                                        >
                                            {label}
                                        </Tag>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Dropdown
                            menu={{ items: menuItems }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <div className="version-menu-button">
                                <MoreOutlined />
                            </div>
                        </Dropdown>
                    </div>

                    {/* 差异统计 */}
                    {version.diffStats && (
                        <div className="diff-stats">
                            {version.diffStats.additions > 0 && (
                                <span className="additions">+{version.diffStats.additions}</span>
                            )}
                            {version.diffStats.deletions > 0 && (
                                <span className="deletions">-{version.diffStats.deletions}</span>
                            )}
                            {version.diffStats.modifications > 0 && (
                                <span className="modifications">~{version.diffStats.modifications}</span>
                            )}
                        </div>
                    )}

                    {/* 文件大小 */}
                    {version.fileSize && (
                        <div className="file-size">
                            {(version.fileSize / 1024).toFixed(1)} KB
                        </div>
                    )}
                </div>

                {/* 连接线 */}
                {showConnector && <div className="timeline-connector" />}
            </div>

            {/* 添加标签模态框 */}
            <Modal
                title="添加标签"
                open={labelModalVisible}
                onOk={handleAddLabel}
                onCancel={() => {
                    setLabelModalVisible(false);
                    setNewLabel('');
                }}
                okText="添加"
                cancelText="取消"
                confirmLoading={actionLoading}
            >
                <Input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="请输入标签内容（最多50个字符）"
                    maxLength={50}
                    onPressEnter={handleAddLabel}
                />
            </Modal>
        </>
    );
};

export default VersionCard;