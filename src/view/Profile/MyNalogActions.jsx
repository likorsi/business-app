import {inject, observer} from "mobx-react";
import {Form} from "react-bootstrap";
import {runInAction} from "mobx";
import React from "react";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";

const MyNalogActions = inject("AuthStore")(observer(({AuthStore}) => (
    <>
        <ModalWindow
            title={lang.incomeName}
            subtitle={lang.incomeNameHelp}
            submitText={lang.saveText}
            submitType='outline-info'
            disableSave={!AuthStore.newIncomeName.trim() || AuthStore.newIncomeName.length > 255}
            show={AuthStore.isEditIncomeNameWindowOpen}
            onClose={() => AuthStore.onCloseWindow()}
            onSubmit={() => AuthStore.onEditIncomeName()}
        >
            <Form.Group className="mb-3">
                <Form.Label><div className='required'/>{lang.incomeNameShort}</Form.Label>
                <Form.Control
                    placeholder={lang.incomeNamePlaceholder}
                    type="text"
                    value={AuthStore.newIncomeName}
                    onChange={e => runInAction(() => {AuthStore.newIncomeName = e.target.value})}
                />
            </Form.Group>
        </ModalWindow>

        <ModalWindow
            title={lang.loginToMyNalog}
            submitText={lang.entranceText}
            submitType='outline-info'
            disableSave={!(AuthStore.newPassword.trim() && AuthStore.newEmail.trim())}
            show={AuthStore.isLoginToMyNalogWindowOpen}
            onClose={() => AuthStore.onCloseWindow()}
            onSubmit={() => AuthStore.onLoginToMyNalog()}
        >
            <p className='hint'>{lang.loginToMyNalogHelp}</p>
            <Form.Group className="mb-3">
                <Form.Label><div className='required'/>{lang.profile.login}</Form.Label>
                <Form.Control
                    type="text"
                    value={AuthStore.newEmail}
                    onChange={e => runInAction(() => {AuthStore.newEmail = e.target.value})}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label><div className='required'/>{lang.profile.password}</Form.Label>
                <Form.Control
                    type="password"
                    value={AuthStore.newPassword}
                    onChange={e => runInAction(() => {AuthStore.newPassword = e.target.value})}
                />
            </Form.Group>
        </ModalWindow>
    </>
)))

export default MyNalogActions