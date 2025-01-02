import {ClientContext, LiveblocksProvider, RoomProvider} from "@liveblocks/react";
import {CollaborativeEditor} from "./Editor/CollaborativeEditor.js";
//工作区主程序，房间id，key设置。。。
export const WorkPlace = ({roomId})=>{

    return (
        <LiveblocksProvider publicApiKey="pk_prod_g7KoCfD9JTy4H3_Y_hacY8ZtYQSlHNJluKJjn7CGiIiXGET_Lm5UU1SDM36OijAs">
            <RoomProvider id={roomId}>
                <ClientContext fallback={<div>Build...</div>}>
                    <CollaborativeEditor/>
                </ClientContext>
            </RoomProvider>
        </LiveblocksProvider>
    )
}

