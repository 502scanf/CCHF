import nullImg from '@assets/null.jpg';
import './FileSpace.css'

const FileSpace = () => {
    return(
        <div className="file-container">
            <img src={nullImg} alt="Null Image" className="null-img"/>
        </div>
    )
}

export default FileSpace