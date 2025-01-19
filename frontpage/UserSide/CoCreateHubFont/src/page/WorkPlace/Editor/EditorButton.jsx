import {Editor, Transforms} from "slate";
import {Element as SlateElement} from "slate";
import {useSlate} from "slate-react";
import {Button, Icon} from "./component/index.jsx";

const LIST_TYPE = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPE = ['left', 'right', 'center', 'justify']

function isBlockActive (editor, format, blockType='type'){
    const {selection} = editor

    if (!selection) return false

    const [match] = Array.from(
        Editor.nodes(editor,{
            at: Editor.unhangRange(editor,selection),
            match: n =>
                !Editor.isEditor(n)&&
                SlateElement.isElement(n)&&
                n[blockType] === format
        })
    )
    return !!match
}

function isMarkActive(editor, format){
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}
// 标记格式
function toggleMark(editor, format){
    const isActive = isMarkActive(editor, format)
    if(!isActive)
        Editor.addMark(editor, format, true)
    else
        Editor.removeMark(editor, format)
}
// 块级格式
function toggleBlock(editor, format){
    const isActive = isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPE.includes(format)? 'align': 'type'
        )

    const isList = LIST_TYPE.includes(format)
    // 移除选中的文本的块级父节点,例如numbered-list等
    Transforms.unwrapNodes(editor,{
        match: n=>
            !Editor.isEditor(n)&&
            SlateElement.isElement(n)&&
            LIST_TYPE.includes(n['type'])&&
            !TEXT_ALIGN_TYPE.includes(format),
        split: true
    })

    let newProperties;
    if(TEXT_ALIGN_TYPE.includes(format)){
        newProperties = {
            align: isActive? undefined: format
        }
    }else{
        newProperties={
            type: isActive? 'paragraph': isList? 'list-item': format
        }
    }

    Transforms.setNodes(editor,newProperties)
    if(!isActive && isList){
        const block = {type: format, children:[]}
        Transforms.wrapNodes(editor, block)
    }
}

//块级按钮
export const BlockButton = ({format, children})=>{
    const editor = useSlate()
    return(
        <Button
           active={
            isBlockActive(
               editor,
                format,
                TEXT_ALIGN_TYPE.includes(format) ? 'align' : 'type'
           )}

           onMouseDown={event => {
               event.preventDefault();
               toggleBlock(editor,format)
           }}
        >
            <Icon>{children}</Icon>

        </Button>
    )
}
//标记按钮
export const MarkButton = ({format, children})=>{
    const editor = useSlate()
    return(
        <Button
            active={isMarkActive(editor, format)}
            onMouseDown={event=>{
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
           <Icon>{children}</Icon>
        </Button>
    )
}
