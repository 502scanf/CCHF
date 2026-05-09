import { useMemo, useCallback } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { Spin } from 'antd';
import {
    FormatListNumbered,
    FormatListBulleted,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight,
    FormatAlignJustify,
    FormatQuote,
    LooksTwo,
    LooksOne,
    Code,
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    MoreHoriz
} from "@mui/icons-material";
import './ReadOnlyEditor.css';

const ReadOnlyEditor = ({ content, loading }) => {
    // 创建只读编辑器实例
    const editor = useMemo(() => withReact(createEditor()), []);

    // 解析内容为Slate格式
    const value = useMemo(() => {
        if (!content || content.trim() === '') {
            return [
                {
                    type: 'paragraph',
                    children: [{ text: '暂无内容' }],
                },
            ];
        }

        try {
            // 尝试解析为JSON（Slate格式）
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            // 如果不是JSON，作为纯文本处理
        }

        // 将纯文本转换为Slate格式
        const lines = content.split('\n');
        return lines.map(line => ({
            type: 'paragraph',
            children: [{ text: line || '' }],
        }));
    }, [content]);

    // 渲染元素 - 与主编辑器完全一致
    const renderElement = useCallback((props) => {
        const style = { textAlign: props.element.align };
        switch (props.element.type) {
            case 'block-quote':
                return <blockquote style={style} {...props.attributes}>{props.children}</blockquote>;
            case 'bulleted-list':
                return <ul style={style} {...props.attributes}>{props.children}</ul>;
            case 'heading-one':
                return <h1 style={style} {...props.attributes}>{props.children}</h1>;
            case 'heading-two':
                return <h2 style={style} {...props.attributes}>{props.children}</h2>;
            case 'list-item':
                return <li style={style} {...props.attributes}>{props.children}</li>;
            case 'numbered-list':
                return <ol style={style} {...props.attributes}>{props.children}</ol>;
            case 'paragraph':
            default:
                return <p style={style} {...props.attributes}>{props.children}</p>;
        }
    }, []);

    // 渲染叶子节点 - 与主编辑器完全一致
    const renderLeaf = useCallback((props) => {
        let { children } = props;

        if (props.leaf.bold) {
            children = <strong>{children}</strong>;
        }
        if (props.leaf.code) {
            children = <code>{children}</code>;
        }
        if (props.leaf.italic) {
            children = <em>{children}</em>;
        }
        if (props.leaf.underline) {
            children = <u>{children}</u>;
        }

        return <span {...props.attributes}>{children}</span>;
    }, []);

    if (loading) {
        return (
            <div className="readonly-editor-loading">
                <Spin size="large" />
                <p>加载内容中...</p>
            </div>
        );
    }

    return (
        <div className="readonly-holeEditor">
            <Slate editor={editor} initialValue={value}>
                {/* 工具栏 - 禁用状态 */}
                <div className="readonly-topbar">
                    <span className="readonly-toolbar-button"><FormatBold /></span>
                    <span className="readonly-toolbar-button"><FormatItalic /></span>
                    <span className="readonly-toolbar-button"><FormatUnderlined /></span>
                    <span className="readonly-toolbar-button"><Code /></span>
                    <span className="readonly-toolbar-button"><LooksOne /></span>
                    <span className="readonly-toolbar-button"><LooksTwo /></span>
                    <span className="readonly-toolbar-button"><FormatQuote /></span>
                    <span className="readonly-toolbar-button"><FormatListNumbered /></span>
                    <span className="readonly-toolbar-button"><FormatListBulleted /></span>
                    <span className="readonly-toolbar-button"><FormatAlignLeft /></span>
                    <span className="readonly-toolbar-button"><FormatAlignCenter /></span>
                    <span className="readonly-toolbar-button"><FormatAlignRight /></span>
                    <span className="readonly-toolbar-button"><FormatAlignJustify /></span>
                    <span className="readonly-toolbar-button"><MoreHoriz /></span>
                </div>
                <Editable
                    readOnly
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    className="readonly-editable"
                    placeholder="暂无内容"
                />
            </Slate>
        </div>
    );
};

export default ReadOnlyEditor;
