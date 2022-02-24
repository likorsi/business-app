import React from "react";
import {Button, Form} from "react-bootstrap";
import {lang} from "../../lang";
import {PromptModal} from "../../components/PromptModal";
import ToastNotify from "../../components/ToastNotify";
import {inject, observer} from "mobx-react";

const Contacts = inject("ContactsStore")(observer(({ContactsStore}) => {
    return (
        <>
            <Button variant="outline-primary">{lang.addContact}</Button>

            <ToastNotify
                show={ContactsStore.isShowToast || false}
                onClose={() => (ContactsStore.isShowToast = false)}
                text={ContactsStore.toastText}
                isSuccess={ContactsStore.toastStatus}
            />

            <PromptModal
                title={lang.editProduct}
                submitText={lang.saveText}
                submitType='outline-info'
                show={ContactsStore.isEditWindowOpen}
                onClose={() => ContactsStore.onCloseWindow()}
                onSubmit={() => (ContactsStore.isEditWindowOpen = false)}
            >
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control type="text" value={ContactsStore.selectedProduct?.name} />
                    </Form.Group>
                </Form>
            </PromptModal>
        </>
    )
}))

export default Contacts