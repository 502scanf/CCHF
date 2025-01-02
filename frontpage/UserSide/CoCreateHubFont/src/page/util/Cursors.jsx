import {
    useRemoteCursorOverlayPositions
} from "@slate-yjs/react";
import {useRef} from "react";
import './utils.scss'

export const Cursors = ({children})=>{
    const containerRef = useRef(null)
    const [cursors] = useRemoteCursorOverlayPositions({containerRef})
    return(
        <div className="cursors" ref={containerRef}>
            {children}
            {cursors.map((cursor) => (
               <Selection key={cursor.clientId} {...cursor}/>
            ))}
        </div>
    )
}

const Selection =({data, selectionRects, caretPosition})=>{
    if (!data) return null

    const selectionStyle = {
        backgroundColor: data.color
    }

    return (
        <>
            {
                selectionRects.map((position,i) =>(
                    <div
                        className="selection"
                        style={{...position, ...selectionStyle}}
                        key={i}
                    />
                ))
            }
            {caretPosition && <Care data={data} carePosition={caretPosition}/>}
        </>
    )
}

const Care = ({data, carePosition})=>{
    const caretStyle = {
        ...carePosition,
        background:data?.color
    }

    const labelStyle ={
        transform: 'translateY(-100%)',
        background: data?.color
    }

    return(
        <div style={caretStyle} className="caretMarker">
            <div style={labelStyle} className="caret">
                {data?.name}
            </div>
        </div>
    )
}
