// form表单填写
import './component.css'
export const PopForm = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {children}
                <span className="close-button" onClick={() => onClose()}>
                  &times;
                </span>
            </div>
        </div>
    );
};
