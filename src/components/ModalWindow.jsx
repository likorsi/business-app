import React from "react";
import PropTypes from "prop-types";
import {Button, Modal, Stack} from "react-bootstrap";
import {lang} from "../lang";

const ModalWindow = ({show, title, subtitle, submitType, submitText, onSubmit, onClose, children, disableSave, hideFooter, fullscreen}) => {
    return (
        <>
            <Modal
                show={show}
                fullscreen={fullscreen || false}
                onHide={() => onClose()}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                { title?.toString() &&
                    <Modal.Header closeButton>
                        <Stack>
                            <Modal.Title>{title}</Modal.Title>
                            {subtitle && <p className='hint' style={{marginTop: 10, fontSize: '1em'}}>{subtitle}</p>}
                        </Stack>
                    </Modal.Header>
                }
                { children && <Modal.Body>{children}</Modal.Body> }
                {
                    hideFooter || <Modal.Footer>
                        <Button variant="light" onClick={() => onClose()}>
                            { lang.rejectPromptText }
                        </Button>
                        <Button
                            disabled={disableSave || false}
                            variant={`${submitType || 'light'}`}
                            onClick={() => onSubmit()}
                        >
                            { submitText || lang.saveText }
                        </Button>
                    </Modal.Footer>
                }
            </Modal>
        </>
    );
}

ModalWindow.propTypes = {
    show: PropTypes.bool.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    submitType: PropTypes.string,
    submitText: PropTypes.string,
    onSubmit: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
    disableSave: PropTypes.bool,
    hideFooter: PropTypes.bool,
    fullscreen: PropTypes.bool
}

export default ModalWindow