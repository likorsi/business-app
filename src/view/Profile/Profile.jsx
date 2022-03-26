import React, {useEffect} from "react";
import {Button, Card, Form, Stack} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {lang} from "../../lang";
import Edit from "../../../public/icons/edit.svg";
import {runInAction} from "mobx";
import ModalWindow from "../../components/ModalWindow";
import ToastNotify from "../../components/ToastNotify";
import {useLocation} from "react-router-dom";

const Profile = inject("AuthStore")(observer(({AuthStore}) => {

    let location = useLocation()

    useEffect(() => {
        location.pathname === '/profile' && AuthStore.onInitProfile()
    }, [location.pathname])

    return (
        <div className='centered'>
            <Card style={{ width: '100%' }}>
                <Card.Body>
                    <Stack direction='horizontal' style={{marginBottom: 20}}>
                        <Card.Title>{AuthStore.profile?.displayName || AuthStore.profile?.email}</Card.Title>
                        <Button
                            style={{marginBottom: 4}}
                            onClick={() => runInAction(() => {
                                AuthStore.name = AuthStore.profile?.displayName || AuthStore.profile?.email
                                AuthStore.isEditNameWindowOpen = true
                            })}
                            variant="light"
                            size='sm'
                            className='my-btn'
                        >
                            <Edit/>
                        </Button>
                    </Stack>

                    <Form.Check
                        style={{marginBottom: 15}}
                        checked={AuthStore.useMyTax}
                        label={lang.profile.useMyTaxAccount}
                        onChange={e => AuthStore.onCheckMyTaxOption(e.target.checked)}
                    />

                    <Stack direction='horizontal'>
                        <Card.Subtitle>{lang.profile.email}</Card.Subtitle>
                        <Button
                            style={{marginBottom: 4}}
                            onClick={() => runInAction(() => {
                                AuthStore.email.value = AuthStore.profile?.email || ''
                                AuthStore.email.value && (AuthStore.email.valid = true)
                                AuthStore.isEditEmailWindowOpen = true
                            })}
                            variant="light"
                            size='sm'
                            className='my-btn'
                        >
                            <Edit/>
                        </Button>
                    </Stack>
                    <Card.Text>{AuthStore.profile?.email}</Card.Text>

                    <Button
                        style={{marginBottom: 20}}
                        variant="outline-secondary"
                        onClick={() => runInAction(() => {
                            AuthStore.email.value = AuthStore.profile?.email || ''
                            AuthStore.email.value && (AuthStore.email.valid = true)
                            AuthStore.isEditPasswordWindowOpen = true
                        })}
                    >
                        {lang.changePassword}
                    </Button>


                    <Card.Subtitle>{lang.profile.publicUrl}</Card.Subtitle>
                    <p className="hint">{lang.profile.publicUrlSub}</p>
                    <Card.Text><a href={AuthStore.publicUrl} target='_blank'>{AuthStore.publicUrl}</a></Card.Text>

                    <Button
                        style={{marginBottom: 20}}
                        variant="outline-danger"
                        onClick={() => runInAction(() => (AuthStore.isDeleteAccountWindowOpen = true))}
                    >
                        {lang.deleteAccount}
                    </Button>
                </Card.Body>
            </Card>

            <ModalWindow
                title={lang.profile.email}
                submitText={lang.saveText}
                submitType='outline-info'
                disableSave={!(AuthStore.validateEmail(AuthStore.newEmail) && AuthStore.isFormValid)}
                show={AuthStore.isEditEmailWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditEmail()}
            >
                <p className='hint'>{lang.changeEmailHelpText}</p>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.newEmail}</Form.Label>
                    <Form.Control
                        type="email"
                        value={AuthStore.newEmail}
                        onChange={e => runInAction(() => {AuthStore.newEmail = e.target.value})}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.email}</Form.Label>
                    <Form.Control
                        type="email"
                        value={AuthStore.email.value}
                        onChange={e => AuthStore.onChangeEmailHandler(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.password}</Form.Label>
                    <Form.Control
                        type="password"
                        value={AuthStore.password.value}
                        onChange={e => AuthStore.onChangePasswordHandler(e.target.value)}
                    />
                </Form.Group>
            </ModalWindow>

            <ModalWindow
                title={lang.profile.name}
                submitText={lang.saveText}
                submitType='outline-info'
                disableSave={!AuthStore.name.trim()}
                show={AuthStore.isEditNameWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditName()}
            >
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.name}</Form.Label>
                    <Form.Control
                        type="text"
                        value={AuthStore.name}
                        onChange={e => runInAction(() => {AuthStore.name = e.target.value})}
                    />
                </Form.Group>
            </ModalWindow>

            <ModalWindow
                title={lang.profile.password}
                submitText={lang.saveText}
                submitType='outline-info'
                disableSave={!(AuthStore.validatePassword(AuthStore.newPassword) && AuthStore.isFormValid)}
                show={AuthStore.isEditPasswordWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditPassword()}
            >
                <p className='hint'>{lang.changePasswordHelpText}</p>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.newPassword}</Form.Label>
                    <Form.Control
                        type="password"
                        value={AuthStore.newPassword}
                        onChange={e => runInAction(() => {AuthStore.newPassword = e.target.value})}
                    />
                </Form.Group>
                <p className='hint'>{lang.inputPasswordHelpText}</p>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.email}</Form.Label>
                    <Form.Control
                        type="email"
                        value={AuthStore.email.value}
                        onChange={e => AuthStore.onChangeEmailHandler(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.password}</Form.Label>
                    <Form.Control
                        type="password"
                        value={AuthStore.password.value}
                        onChange={e => AuthStore.onChangePasswordHandler(e.target.value)}
                    />
                </Form.Group>
            </ModalWindow>

            <ModalWindow
                title={lang.deleteAccount}
                submitText={lang.deletePromptText}
                submitType='outline-danger'
                show={AuthStore.isDeleteAccountWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onDeleteAccount()}
            >{lang.deleteAccountPrompt}</ModalWindow>

            <ToastNotify
                show={AuthStore.isShowToast || false}
                onClose={() => runInAction(() => AuthStore.isShowToast = false)}
                text={AuthStore.toastText}
                isSuccess={!AuthStore.error}
            />
        </div>
    )
}))

export default Profile