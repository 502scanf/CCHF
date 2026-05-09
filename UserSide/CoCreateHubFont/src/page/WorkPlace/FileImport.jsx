import React, { useState } from 'react';
import { Modal, Upload, message, Input, Form } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import mammoth from 'mammoth';
import { htmlToSlate, markdownToSlate, prepareSlateNodesForImport } from '../util/importUtils.js';

const { Dragger } = Upload;

const FileImport = ({ visible, onClose, onImport, docroomid }) => {
    const [form] = Form.useForm();
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');

    const handleFileUpload = async (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (fileExtension === 'md') {
            // 处理 Markdown 文件
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setFileContent(content);
                setFileName(file.name.replace('.md', ''));
                setFileType('md');
                form.setFieldsValue({ docname: file.name.replace('.md', '') });
            };
            reader.readAsText(file);
        } else if (fileExtension === 'docx') {
            // 处理 Word 文件
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    setFileContent(result.value);
                    setFileName(file.name.replace('.docx', ''));
                    setFileType('html');
                    form.setFieldsValue({ docname: file.name.replace('.docx', '') });
                    if (result.messages.length > 0) {
                        console.warn('Word conversion warnings:', result.messages);
                    }
                } catch (error) {
                    message.error('Word 文件解析失败');
                    console.error(error);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            message.error('不支持的文件格式，请上传 .md 或 .docx 文件');
            return false;
        }

        return false; // 阻止自动上传
    };

    const handleSubmit = async (values) => {
        if (!fileContent) {
            message.error('请先选择文件');
            return;
        }

        try {
            // 将内容转换为 Slate 节点
            let slateNodes;
            if (fileType === 'md') {
                slateNodes = markdownToSlate(fileContent);
            } else if (fileType === 'html') {
                slateNodes = htmlToSlate(fileContent);
            }

            // 准备导入数据 - 先创建空文档，然后插入内容
            const data = {
                docname: values.docname,
                docroomid,
                doctype: 'txt',
                content: '', // 发送空内容，实际内容将在前端插入
                // 传递 Slate 节点用于后续插入
                importContent: slateNodes
            };

            await onImport(data);
            handleClose();
        } catch (error) {
            message.error('文件处理失败');
            console.error(error);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setFileContent('');
        setFileName('');
        setFileType('');
        onClose();
    };

    return (
        <Modal
            title="导入文件"
            open={visible}
            onCancel={handleClose}
            onOk={() => form.submit()}
            okText="导入"
            cancelText="取消"
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item>
                    <Dragger
                        accept=".md,.docx"
                        beforeUpload={handleFileUpload}
                        maxCount={1}
                        showUploadList={false}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                        <p className="ant-upload-hint">
                            支持 Markdown (.md) 和 Word (.docx) 格式
                        </p>
                    </Dragger>
                </Form.Item>

                {fileName && (
                    <Form.Item
                        label="文件名称"
                        name="docname"
                        rules={[{ required: true, message: '请输入文件名称' }]}
                    >
                        <Input placeholder="请输入文件名称" />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default FileImport;
