import React from "react";
import PropTypes from "prop-types";
import {Toast} from "react-bootstrap";
import Notify from '../../public/icons/notify.svg';

const ToastNotify = ({onClose, show, text, delay, isSuccess}) => (
    <Toast
        style={{position: 'fixed', top: 10, right: 10, zIndex: 40000, maxWidth: 250}}
        onClose={onClose}
        show={show}
        delay={delay || 10000}
        bg={isSuccess ? 'success' : 'danger'}
        autohide
    >
        <Toast.Header><strong className="me-auto"><Notify /></strong></Toast.Header>
        <Toast.Body style={{color: 'white'}}>{text}</Toast.Body>
    </Toast>
)

ToastNotify.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    delay: PropTypes.number,
    isSuccess: PropTypes.bool
}

export default ToastNotify