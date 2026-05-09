import { useState } from 'react';
import { Dropdown, Modal, Input, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, HistoryOutlined } from '@ant-design/icons';
import buildLogo2 from '@assets/buildLogo2.svg';
import VersionHistory from './VersionHistory/VersionHistory';
import './FileList.css';

const FileList = ({ docList, selectedDoc, onDocSelect, onNewFile, onRename, onDelete }) => {
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [currentDoc, setCurrentDoc] = useState(null);
    const [newName, setNewName] = useState('');
    const [versionHistoryVisible, setVersionHistoryVisible] = useState(false);
    const [versionHistoryDocId, setVersionHistoryDocId] = useState(null);

    const handleRename = (doc) => {
        setCurrentDoc(doc);
        setNewName(doc.docname);
        setRenameModalVisible(true);
    };

    const handleRenameConfirm = () => {
        if (!newName.trim()) {
            message.error('文件名不能为空');
            return;
        }
        onRename(currentDoc.docid, newName);
        setRenameModalVisible(false);
        setCurrentDoc(null);
        setNewName('');
    };

    const handleDelete = (doc) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除文件 "${doc.docname}" 吗？`,
            okText: '确认',
            cancelText: '取消',
            okButtonProps: { danger: true },
            onOk: () => onDelete(doc.docid)
        });
    };

    const handleVersionHistory = (doc) => {
        setVersionHistoryDocId(doc.docid);
        setVersionHistoryVisible(true);
    };

    const getMenuItems = (doc) => [
        {
            key: 'rename',
            label: '重命名',
            icon: <EditOutlined />,
            onClick: () => handleRename(doc)
        },
        {
            key: 'version-history',
            label: '版本历史',
            icon: <HistoryOutlined />,
            onClick: () => handleVersionHistory(doc)
        },
        {
            key: 'delete',
            label: '删除',
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(doc)
        }
    ];

    // 格式化时间显示
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // 小于1分钟显示"刚刚"
        if (diff < 60000) {
            return '刚刚';
        }

        // 小于1小时显示"X分钟前"
        if (diff < 3600000) {
            return `${Math.floor(diff / 60000)}分钟前`;
        }

        // 小于24小时显示"X小时前"
        if (diff < 86400000) {
            return `${Math.floor(diff / 3600000)}小时前`;
        }

        // 小于7天显示"X天前"
        if (diff < 604800000) {
            return `${Math.floor(diff / 86400000)}天前`;
        }

        // 超过7天显示具体日期
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="file-list-container">
                <div className="file-list-header">
                    <FileTextOutlined className="file-list-icon" />
                    <span className="file-list-title">文件列表</span>
                </div>

                <div className="file-list-content">
                    {docList && docList.map(item => (
                        <div
                            key={item.docid}
                            className={`file-item ${selectedDoc === item.docid ? 'file-item-active' : ''}`}
                            onClick={() => onDocSelect(item.docid)}
                        >
                            <div className="file-item-main">
                                <div className="file-item-content">
                                    <FileTextOutlined className="file-icon" />
                                    <span className="file-name">{item.docname}</span>
                                </div>
                                <div className="file-item-meta">
                                    <span className="file-updater">
                                        {item.updater || '未知用户'}
                                    </span>
                                    <span className="file-update-time">
                                        {formatTime(item.updatetime)}
                                    </span>
                                </div>
                            </div>
                            <Dropdown
                                menu={{ items: getMenuItems(item) }}
                                trigger={['click']}
                                placement="bottomRight"
                            >
                                <div
                                    className="file-menu-button"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreOutlined />
                                </div>
                            </Dropdown>
                        </div>
                    ))}

                    <div className="file-item file-item-new" onClick={onNewFile}>
                        <div className="file-item-content">
                            <img src={buildLogo2} alt="new" className="file-icon-img" />
                            <span className="file-name">新建文件</span>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="重命名文件"
                open={renameModalVisible}
                onOk={handleRenameConfirm}
                onCancel={() => {
                    setRenameModalVisible(false);
                    setCurrentDoc(null);
                    setNewName('');
                }}
                okText="确认"
                cancelText="取消"
            >
                <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="请输入新文件名"
                    onPressEnter={handleRenameConfirm}
                />
            </Modal>

            {/* 版本历史模态框 */}
            <VersionHistory
                docid={versionHistoryDocId}
                visible={versionHistoryVisible}
                onClose={() => {
                    setVersionHistoryVisible(false);
                    setVersionHistoryDocId(null);
                }}
            />
        </>
    );
};

export default FileList;
