import React from 'react';
import './Modal.scss';

const Modal = ({ isOpen, onClose, children, showCloseButton = true }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {showCloseButton && (
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;