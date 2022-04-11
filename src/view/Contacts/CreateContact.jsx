import React from "react";
import {Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";

const CreateContact = inject("ContactsStore")(observer(({ContactsStore}) => (
    <ModalWindow
        title={ContactsStore.newContact.id ? ContactsStore.newContact.name : lang.createContact}
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
            {!ContactsStore.newContact.validatePhone() &&
                <p className='hint-warning'>{lang.errorPhone}</p>
            }
            <Form.Control
                type="tel"

                value={ContactsStore.newContact.phone || ''}
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