import React, {useEffect} from "react";
import {Button, Stack, Table} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import {useLocation} from "react-router-dom";
import ModalWindow from "../../components/ModalWindow.jsx";
import ToastNotify from "../../components/ToastNotify";
import {Loader} from "../../components/Loader/Loader";
import CreateContact from "./CreateContact";
import Delete from "../../../public/icons/delete.svg";
import Edit from "../../../public/icons/edit.svg";
import {lang} from "../../lang";

const Contacts = inject("ContactsStore")(observer(({ContactsStore}) => {

    const location = useLocation()

    useEffect(() => {
        location.pathname.startsWith('/contacts') && ContactsStore.onInit()
    }, [location.pathname])

    return (
        <>
            <Stack direction="horizontal" gap={2} style={{flexWrap: 'wrap', marginBottom: 5}}>
                <Button
                    variant="outline-secondary"
                    onClick={() => runInAction(() => (ContactsStore.isModifyWindowOpen = true))}
                >
                    {lang.addContact}
                </Button>
            </Stack>

            { ContactsStore.loading
                ? <div className='centered'><Loader/></div>
                : ContactsStore.contacts.length > 0
                    ? <Table responsive borderless style={{marginTop: 15}}>
                        <tbody>
                        <tr>
                            <th>{lang.contact.name}</th>
                            <th>{lang.contact.phone}</th>
                            <th>{lang.contact.description}</th>
                            <th/>
                            <th/>
                        </tr>
                        { ContactsStore.contacts.map((contact, index) => (
                            <tr key={index} style={{verticalAlign: 'middle'}}>
                                <td>{contact.name}</td>
                                <td>
                                    <a
                                        href={`tel:${contact.replacePhone}`}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        {contact.beautifulPhone}
                                    </a>
                                </td>
                                {contact.description ? <td>{contact.description.split('\n').map((row, index) => <span key={index}>{row}<br/></span>)}</td> : <td>&ndash;</td>}
                                <td style={{width: '5%', marginLeft: 5}}>
                                    <Button
                                        className='my-btn'
                                        onClick={(e) => runInAction(() => {
                                            ContactsStore.newContact.init(contact)
                                            ContactsStore.isDeleteWindowOpen = true
                                        })}
                                        variant="light"
                                        size='sm'
                                    ><Delete/></Button>
                                </td>
                                <td style={{width: '5%'}}>
                                    <Button
                                        className='my-btn'
                                        onClick={(e) => runInAction(async () => {
                                            ContactsStore.newContact.init(contact)
                                            ContactsStore.isModifyWindowOpen = true
                                        })}
                                        variant="light"
                                        size='sm'
                                    ><Edit/></Button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                    : <div className='centered'>{lang.noContacts}</div>
            }

            <ToastNotify
                show={ContactsStore.isShowToast || false}
                onClose={() => runInAction(() => ContactsStore.isShowToast = false)}
                text={ContactsStore.toastText}
                isSuccess={!ContactsStore.error}
            />

            <ModalWindow
                title={lang.deleteContact}
                submitText={lang.deletePromptText}
                submitType='outline-danger'
                show={ContactsStore.isDeleteWindowOpen}
                onClose={() => ContactsStore.onCloseWindow()}
                onSubmit={() => ContactsStore.onDeleteContact()}
            >
                {`Вы действительно хотите удалить контакт "${ContactsStore.newContact?.name}"?`}
            </ModalWindow>

            <CreateContact/>
        </>
    )
}))

export default Contacts