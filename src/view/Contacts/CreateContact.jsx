import React from "react";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";
import {Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";

const CreateContact = inject("ContactsStore")(observer(({ContactsStore}) => (
    <ModalWindow
        title={ContactsStore.selected ? ContactsStore.selected?.name : lang.createContact}
        submitText={lang.saveText}
        submitType='outline-info'
        disableSave={!ContactsStore.newContact.checkRequiredFields()}
        show={ContactsStore.isModifyWindowOpen}
        onClose={() => ContactsStore.onCloseWindow()}
        onSubmit={() => ContactsStore.onModifyContact()}
    >
        <Form.Group className="mb-3">
            <Form.Label><div className='required'/>{lang.contact.name}</Form.Label>
            <Form.Control
                type="text"
                value={ContactsStore.newContact?.name || ''}
                onChange={event => runInAction(() => (ContactsStore.newContact.name = event.target.value))}
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label><div className='required'/>{lang.contact.phone}</Form.Label>
            <Form.Control
                type="text"
                value={ContactsStore.newContact?.phone || ''}
                onChange={event => runInAction(() => (ContactsStore.newContact.phone = event.target.value))}
            />
        </Form.Group>
        <Form.Group className="mb-3">
            <Form.Label>{lang.contact.description}</Form.Label>
            <Form.Control
                as="textarea"
                value={ContactsStore.newContact?.description || ''}
                onChange={event => runInAction(() => (ContactsStore.newContact.description = event.target.value))}
            />
        </Form.Group>
    </ModalWindow>
)))

export default CreateContact