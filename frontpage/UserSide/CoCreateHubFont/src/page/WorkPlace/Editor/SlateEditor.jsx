//创建编译器
import {useEffect, useMemo} from "react";
import {withHistory} from "slate-history";
import {Editable, Slate, withReact} from "slate-react";
import {withCursors, withYjs, YjsEditor} from "@slate-yjs/core";
import {createEditor, Editor, Transforms} from "slate";
import {Cursors} from "../../util/Cursors.jsx";
export const SlateEditor = ({shareType, provider})=>{
    // 对编辑器的创建，设置历史，光标
    const editor = useMemo(()=>{
        const e =
            withHistory(withReact(withCursors(withYjs(createEditor(), shareType), provider.awareness, {
                    data:{
                        name: 'Chris',
                        color:'#00ff00'
                    },
                })
            ))
        // 确保编辑器在没有任何的输入时也有子节点
        const { normalizeNode } = e
        e.normalizeNode = entry => {
            const [node] = entry

            if (!Editor.isEditor(node) || node.children.length > 0) {
                return normalizeNode(entry)
            }

            Transforms.insertNodes(editor, initialValue, { at: [0] })
        }
        return e
    },[])

    useEffect(()=>{
        YjsEditor.connect(editor)
        return () => YjsEditor.disconnect(editor)
    },[editor])

    return(
        <Slate editor={editor} initialValue={initialValue}>
            //设置顶部功能栏目
            <Cursors>
                <Editable
                    className="editable"
                    placeholder="Enter some content ... "
                    spellCheck
                    autoFocus
                    onKeyDown={event=>{

                    }}
                />
            </Cursors>
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
        case 'numbered-list':
            return (
                <ol style={style} {...attributes}>
                    {children}
                </ol>
            )
        case  'heading-one':
            return (
                <h1 style={style} {...attributes}>
                    {children}
                </h1>
            )
        case  'list-item':
            return (
                <li style={style} {...attributes}>
                    {children}
                </li>
            )
        default:
            return (
                <p style={style} {...attributes}>
                    {children}
                </p>
            )
    }
}
//标记
const Leaf = ({attribute, children, leaf})=>{
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
        <span {...attribute}>{children}</span>
    )
}
