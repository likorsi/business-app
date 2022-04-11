import {inject, observer} from "mobx-react";
import {Form} from "react-bootstrap";
import {runInAction} from "mobx";
import React from "react";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";

const EditProfile = inject("AuthStore")(observer(({AuthStore}) => (
        <>
            <ModalWindow
                title={lang.deletePhoto}
                submitText={lang.deletePromptText}
                submitType='outline-danger'
                show={AuthStore.isDeletePhotoWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditPhotoUrl()}
            >
                {lang.deletePhotoPrompt}
            </ModalWindow>

            <ModalWindow
                title={lang.profile.helpText}
                subtitle={lang.imagesHint}
                submitText={lang.saveText}
                submitType='outline-info'
                show={AuthStore.isEditPhotoWindowOpen}
                disableSave={!AuthStore.newPhoto}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditPhotoUrl()}
            >
                <Form.Label>{lang.profile.photo}</Form.Label>
                <Form.Group>
                    <Form.Control
                        type="file"
                        onChange={e => AuthStore.checkImage(e.target.files)}
                    />
                </Form.Group>
            </ModalWindow>

            <ModalWindow
                title={lang.profile.helpText}
                submitText={lang.saveText}
                submitType='outline-info'
                show={AuthStore.isEditHelpTextWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditHelpText()}
            >
                <Form.Group className="mb-3">
                    <Form.Label>{lang.profile.helpText}</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder={lang.profile.helpTextPlaceholder}
                        value={AuthStore.newHelpText}
                        onChange={e => runInAction(() => {AuthStore.newHelpText = e.target.value})}
                    />
                </Form.Group>
            </ModalWindow>

            <ModalWindow
                title={lang.profile.email}
                subtitle={lang.changeEmailHelpText}
                submitText={lang.saveText}
                submitType='outline-info'
                disableSave={!(AuthStore.validateEmail(AuthStore.newEmail) && AuthStore.password.valid)}
                show={AuthStore.isEditEmailWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditEmail()}
            >
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.newEmail}</Form.Label>
                    <Form.Control
                        type="email"
                        value={AuthStore.newEmail}
                        onChange={e => runInAction(() => {AuthStore.newEmail = e.target.value})}
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
                disableSave={!AuthStore.newName.trim()}
                show={AuthStore.isEditNameWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditName()}
            >
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.name}</Form.Label>
                    <Form.Control
                        type="text"
                        value={AuthStore.newName}
                        onChange={e => runInAction(() => {AuthStore.newName = e.target.value})}
                    />
                </Form.Group>
            </ModalWindow>

            <ModalWindow
                title={lang.profile.password}
                subtitle={lang.changePasswordHelpText}
                submitText={lang.saveText}
                submitType='outline-info'
                disableSave={!(AuthStore.validatePassword(AuthStore.newPassword) && AuthStore.password.valid)}
                show={AuthStore.isEditPasswordWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onEditPassword()}
            >
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
                    <Form.Label><div className='required'/>{lang.profile.password}</Form.Label>
                    <Form.Control
                        type="password"
                        value={AuthStore.password.value}
                        onChange={e => AuthStore.onChangePasswordHandler(e.target.value)}
                    />
                </Form.Group>
            </ModalWindow>

            <ModalWindow
                title={lang.deleteAccountTitle}
                subtitle={lang.deleteAccountHelpText}
                submitText={lang.deletePromptText}
                disableSave={!AuthStore.validatePassword(AuthStore.password.value)}
                submitType='outline-danger'
                show={AuthStore.isDeleteAccountWindowOpen}
                onClose={() => AuthStore.onCloseWindow()}
                onSubmit={() => AuthStore.onDeleteAccount()}
            >
                <p className='hint-warning'>{lang.deleteAccountPrompt}</p>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.profile.password}</Form.Label>
                    <Form.Control
                        type="password"
                        value={AuthStore.password.value}
                        onChange={e => AuthStore.onChangePasswordHandler(e.target.value)}
                    />
                </Form.Group>
            </ModalWindow>

        </>
)))

export default EditProfile