import nullImg from '@assets/null.jpg';
import './FileSpace.css'
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import doc from "@assets/doc.svg";
import {fetchDocList} from "@page/store/reducers/doc.js";

const FileSpace = () => {
    const {docList} = useSelector(state => state.doc)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(fetchDocList())
    },[dispatch])

    return (
        <div className="doc-container">
            {docList ? (
                <div className="docList">
                    {docList.map((item,index) => (
                        <div key={index} className="doc-item">
                            <img
                                src={doc}
                                alt="Document"
                                className="doc-img"
                            />
                            <span>{item.docid}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <img src={nullImg} alt="Null Image" className="null-img" />
            )}

        </div>
    )
}

export default FileSpace