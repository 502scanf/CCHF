//设置编辑器连接yjs和liveblock
import {ClientSideSuspense, LiveblocksProvider, RoomProvider, useRoom} from "@liveblocks/react";
import {useEffect, useState} from "react";
import * as Y from 'yjs'
import {LiveblocksYjsProvider} from "@liveblocks/yjs";
import {SlateEditor} from "./SlateEditor.jsx";
import loading from '@assets/loading.svg'
 const CollaborativeEditor = ({docId})=> {
     const room = useRoom()
     const [connected, setConnected] = useState(false)
     const [shareType, setShareType] = useState(null)
     const [provider, setProvider] = useState(null)

     useEffect(() => {

         const yDoc = new Y.Doc();

         const yProvider= new LiveblocksYjsProvider(room, yDoc)
         const sharedDoc = yDoc.get(docId, Y.XmlText)
         yProvider.on('sync', setConnected)
         setShareType(sharedDoc)
         setProvider(yProvider)

         return () => {
             yDoc?.destroy()
             yProvider?.off('sync', setConnected)
             yProvider?.destroy()
         }

     }, [room])

     if (!connected || !shareType || !provider)
         return <img src={loading} alt={loading} className="loading"/>

     return (
         <SlateEditor shareType={shareType} provider={provider}/>
     )
 }

export const HoleEditor = ({docId})=>{
    return (
        <LiveblocksProvider publicApiKey="pk_prod_xGHxC0g4wwRVebwmmYrsHYNbllxddxg18y6OPAn41HUkJoibz95b5LqVFoAgJX1t">
            <RoomProvider id={docId}>
                <ClientSideSuspense fallback={<img src={loading} alt={loading} className="loading"/>}>
                    {() => <CollaborativeEditor docId={docId}/>}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}
