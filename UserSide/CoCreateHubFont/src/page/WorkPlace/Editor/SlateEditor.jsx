//创建编译器
import { useCallback, useEffect, useMemo, useState } from "react";
import { Editable, Slate, withReact } from "slate-react";
import { withCursors, withYjs, YjsEditor } from "@slate-yjs/core";
import { createEditor, Editor, Transforms } from "slate";
import { Cursors } from "../../util/Cursors.jsx";
import { TopBar } from "./component/index.jsx";
import { BlockButton, MarkButton } from "./EditorButton.jsx";
import { useSelector } from "react-redux";
import { Dropdown, message } from "antd";
import { serialize, exportToWord } from "../../util/exportUtils.js";

import '../WorkPlace.css'

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


const emptyNode = {
    children: [{ text: '' }],
};
export const SlateEditor = ({ shareType, provider, pendingImportContent, onImportContentInserted }) => {

    const { uname } = useSelector(state => state.user)
    const { backColor } = useSelector(state => state.user)
    const [editorValue, setEditorValue] = useState([emptyNode])

    const initialvalue = useMemo(() => {

    })
    // 对编辑器的创建，设置历史，光标
    const editor = useMemo(() => {
        const e = withReact(withCursors(withYjs(createEditor(), shareType), provider.awareness, {
            data: {
                name: uname,
                color: backColor
            },
        }));

        // 确保编辑器在没有任何的输入时也有子节点
        const { normalizeNode } = e
        e.normalizeNode = entry => {
            const [node] = entry

            if (!Editor.isEditor(node) || node.children.length > 0) {
                return normalizeNode(entry)
            }

            Transforms.insertNodes(editor, emptyNode, { at: [0] })
        }
        return e
    }, [shareType, provider])

    const renderElement = useCallback(props => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

    useEffect(() => {
        YjsEditor.connect(editor)
        return () => YjsEditor.disconnect(editor)
    }, [editor])

    // 处理导入内容插入
    useEffect(() => {
        if (pendingImportContent && editor && YjsEditor.connected(editor)) {
            try {
                // 等待一小段时间确保编辑器完全初始化
                setTimeout(() => {
                    // 清空编辑器内容
                    const allContent = {
                        anchor: Editor.start(editor, []),
                        focus: Editor.end(editor, [])
                    };

                    Transforms.select(editor, allContent);
                    Transforms.delete(editor);

                    // 插入导入的内容
                    Transforms.insertNodes(editor, pendingImportContent, { at: [0] });

                    // 通知父组件内容已插入
                    if (onImportContentInserted) {
                        onImportContentInserted();
                    }
                }, 100);
            } catch (error) {
                console.error('插入导入内容失败:', error);
                // 即使失败也要清除 pending 状态
                if (onImportContentInserted) {
                    onImportContentInserted();
                }
            }
        }
    }, [pendingImportContent, editor, onImportContentInserted]);

    // 导出为 Markdown
    const handleExportMarkdown = () => {
        try {
            const markdown = serialize(editorValue, 'markdown');
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `document_${Date.now()}.md`;
            a.click();
            URL.revokeObjectURL(url);
            message.success('导出 Markdown 成功');
        } catch (error) {
            message.error('导出失败');
            console.error(error);
        }
    };

    // 导出为 Word
    const handleExportWord = async () => {
        try {
            await exportToWord(editorValue, `document_${Date.now()}.docx`);
            message.success('导出 Word 成功');
        } catch (error) {
            message.error('导出失败');
            console.error(error);
        }
    };

    const moreMenuItems = [
        {
            key: 'export-md',
            label: '导出为 Markdown',
            onClick: handleExportMarkdown
        },
        {
            key: 'export-word',
            label: '导出为 Word',
            onClick: handleExportWord
        }
    ];


    return (
        <Slate
            editor={editor}
            initialValue={[emptyNode]}
            onChange={value => {
                setEditorValue(value);
                const isAstChange = editor.operations.some(
                    op => 'set_selection' !== op.type
                )
                if (isAstChange) {

                    const content = JSON.stringify(value)
                    const docid = "80pDtwKvG"


                    // updateDocApi({docid, content})
                    localStorage.setItem('content', content)
                }
            }}
        >
            <div className="holeEditor">

                <TopBar>
                    <MarkButton format="bold"><FormatBold /></MarkButton>
                    <MarkButton format="italic"><FormatItalic /></MarkButton>
                    <MarkButton format="underline"><FormatUnderlined /></MarkButton>
                    <MarkButton format="code"><Code /></MarkButton>
                    <BlockButton format="heading-one"><LooksOne /></BlockButton>
                    <BlockButton format="heading-two"><LooksTwo /></BlockButton>
                    <BlockButton format="block-quote" ><FormatQuote /></BlockButton>
                    <BlockButton format="numbered-list" ><FormatListNumbered /></BlockButton>
                    <BlockButton format="bulleted-list" ><FormatListBulleted /></BlockButton>
                    <BlockButton format="left"><FormatAlignLeft /></BlockButton>
                    <BlockButton format="center" ><FormatAlignCenter /></BlockButton>
                    <BlockButton format="right"><FormatAlignRight /></BlockButton>
                    <BlockButton format="justify"><FormatAlignJustify /></BlockButton>
                    <Dropdown menu={{ items: moreMenuItems }} placement="bottomRight">
                        <button className="toolbar-button">
                            <MoreHoriz />
                        </button>
                    </Dropdown>
                </TopBar>
                <Cursors>
                    <Editable
                        className="editable"
                        placeholder="Enter some content ... "
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                    />
                </Cursors>
            </div>

        </Slate>
    )
}

//渲染块和标记
//块
const Element = ({ attributes, children, element }) => {
    const style = { textAlign: element.align }
    switch (element.type) {
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes}>
                    {children}
                </blockquote>
            )
        case 'bulleted-list':
            return (
                <ul style={style} {...attributes}>
                    {children}
                </ul>
            )
        case 'heading-one':
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            )
        case 'heading-two':
            return (
                <h2 style={style} {...attributes}>
                    {children}
                </h2>
            )
        case 'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            )
        case 'paragraph':
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}
const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }
    if (leaf.code) {
        children = <code>{children}</code>
    }
    if (leaf.italic) {
        children = <em>{children}</em>
    }
    if (leaf.underline) {
        children = <u>{children}</u>
    }
    return (
        <span {...attributes}>{children}</span>
    )
}
