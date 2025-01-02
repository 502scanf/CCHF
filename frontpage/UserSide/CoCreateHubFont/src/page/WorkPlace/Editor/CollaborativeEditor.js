//设置编辑器连接yjs和liveblock
import {useRoom} from "@liveblocks/react";
import {useEffect, useState} from "react";
import * as Y from 'yjs'
import {LiveblocksYjsProvider} from "@liveblocks/yjs";
import {SlateEditor} from 'SlateEditor.jsx'
export const CollaborativeEditor = ()=>{
    const room = useRoom()
    const [connected,setConnected] = useState(false)
    const [shareType, setShareType] = useState(null)
    const [provider, setProvider] = useState(null)

    useEffect(()=>{
        const yDoc = new Y.Doc()
        const sharedDoc = yDoc.get('richText',Y.XmlText)
        const yProvider = new LiveblocksYjsProvider(room,yDoc)

        yProvider.on('sync', setConnected)
        setShareType(sharedDoc)
        setProvider(yProvider)

        return()=>{
            yDoc?.destroy()
            yProvider?.off('sync',setConnected)
            yProvider?.destroy()
        }

    },[room])

    if (!connected||!shareType||!provider)
        return <div>Building...</div>

    return(
        <SlateEditor shareType={shareType} provider={provider}/>
    )
}
