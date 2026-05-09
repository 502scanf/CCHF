import React from 'react';
import { Modal } from 'antd';
import { FileAddOutlined, UploadOutlined } from '@ant-design/icons';
import './FileActionModal.css';

const FileActionModal = ({ visible, onClose, onNewFile, onImportFile }) => {
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={400}
            centered
            className="file-action-modal"
        >
            <div className="file-action-container">
                <div className="file-action-item" onClick={onNewFile}>
                    <FileAddOutlined className="file-action-icon" />
                    <span className="file-action-text">新建文件</span>
                    <p className="file-action-desc">创建一个空白文档</p>
                </div>
                <div className="file-action-item" onClick={onImportFile}>
                    <UploadOutlined className="file-action-icon" />
                    <span className="file-action-text">导入文件</span>
                    <p className="file-action-desc">支持 Word (.docx) 和 Markdown (.md)</p>
                </div>
            </div>
        </Modal>
    );
};

export default FileActionModal;
