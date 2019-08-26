import React from 'react';
import Popup from 'reactjs-popup';
import './Modal.scss';

const Modal = ({ showModal, closeModal }) => (
  <Popup open={showModal} onClose={closeModal} closeOnDocumentClick modal className="popup">
    {close => (
      <div className="container ModalContainer">
        <div className="title">Repeat pasta</div>
        <div className="content">
          <div className="subtitle">Your previous customisation</div>
          <div className="choice">Full bowl</div>
        </div>
        <div className="buttonsContainer">
          <button className="btn">
            Mini bowl
          </button>
          <button className="btn" >
            Regular bowl
          </button>
        </div>
      </div>
    )}
  </Popup>
);

export default Modal;
