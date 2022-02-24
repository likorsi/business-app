import React, {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {lang} from "../lang";

export const PromptModal = props => {
    return (
        <>
            <Modal
                show={props.show}
                onHide={() => props.onClose()}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                { props.title?.toString() &&
                    <Modal.Header closeButton>
                        <Modal.Title>{props.title}</Modal.Title>
                    </Modal.Header>
                }
                { props.children && <Modal.Body>{props.children}</Modal.Body> }
                <Modal.Footer>
                    <Button variant="light" onClick={() => props.onClose()}>
                        { lang.rejectPromptText }
                    </Button>
                    <Button variant={`${props.submitType || 'light'}`} onClick={() => props.onSubmit()}>
                        { props.submitText }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}