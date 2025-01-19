//创建编译器
import {useCallback, useEffect, useMemo} from "react";
import {withHistory} from "slate-history";
import {Editable, Slate, withReact} from "slate-react";
import {withCursors, withYjs, YjsEditor} from "@slate-yjs/core";
import {createEditor, Editor, Transforms} from "slate";
import {Cursors} from "../../util/Cursors.jsx";
import {TopBar} from "./component/index.jsx";
import {BlockButton, MarkButton} from "./EditorButton.jsx";
import '../WorkPlace.css'

import {
    FormatListNumbered,
    FormatListBulleted,
    FormatAlignLeft,
    FormatAlignCenter,
    FormatAlignRight ,
    FormatAlignJustify,
    FormatQuote,
    LooksTwo,
    LooksOne,
    Code,
    FormatBold,
    FormatItalic,
    FormatUnderlined
} from "@mui/icons-material";



const emptyNode = {
    children: [{ text: "" }],
};
export const SlateEditor = ({shareType, provider})=>{
    const userInfo = 'Chris'
       // 对编辑器的创建，设置历史，光标
    const editor = useMemo(()=>{
        const e =
            // withHistory待研究
            withReact(withCursors(withYjs(createEditor(), shareType), provider.awareness, {
                    data:{
                        name: userInfo,
                        color:'#00ff00'
                    },
                })
            )
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
    },[shareType, provider.awareness, userInfo])

    const renderElement = useCallback(props => <Element {...props}/>,[])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

    useEffect(()=>{
        YjsEditor.connect(editor)
        return () => YjsEditor.disconnect(editor)
    },[editor])

    return(
        <Slate editor={editor} initialValue={[emptyNode]} >
            <div className="holeEditor">
                <TopBar>
                    <MarkButton format="bold"><FormatBold/></MarkButton>
                    <MarkButton format="italic"><FormatItalic/></MarkButton>
                    <MarkButton format="underline"><FormatUnderlined/></MarkButton>
                    <MarkButton format="code"><Code/></MarkButton>
                    <BlockButton format="heading-one"><LooksOne/></BlockButton>
                    <BlockButton format="heading-two"><LooksTwo/></BlockButton>
                    <BlockButton format="block-quote" ><FormatQuote/></BlockButton>
                    <BlockButton format="numbered-list" ><FormatListNumbered/></BlockButton>
                    <BlockButton format="bulleted-list" ><FormatListBulleted/></BlockButton>
                    <BlockButton format="left"><FormatAlignLeft/></BlockButton>
                    <BlockButton format="center" ><FormatAlignCenter/></BlockButton>
                    <BlockButton format="right"><FormatAlignRight/></BlockButton>
                    <BlockButton format="justify"><FormatAlignJustify/></BlockButton>
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
const Element = ({attributes, children, element})=>{
    const style = {textAlign: element.align}
    switch (element.type){
        case 'block-quote':
            return(
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
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}
const Leaf = ({attributes,children,leaf })=>{
    if (leaf.bold){
        children = <strong>{children}</strong>
    }
    if(leaf.code){
        children = <code>{children}</code>
    }
    if(leaf.italic){
        children = <em>{children}</em>
    }
    if(leaf.underline){
        children = <u>{children}</u>
    }
    return(
        <span {...attributes}>{children}</span>
    )
}
