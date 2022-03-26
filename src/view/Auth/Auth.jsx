import React from "react";
import styles from './Auth.module.scss'
import {observer, inject} from "mobx-react";
import {lang} from "../../lang";
import {useNavigate} from 'react-router-dom'
import {Button, Form, Stack} from "react-bootstrap";
import ModalWindow from "../../components/ModalWindow";

const Auth = inject("AuthStore")(observer(({AuthStore}) => {

	let navigate = useNavigate();

	function handleSubmit(isLogin) {
		isLogin ? AuthStore.loginHandler() : AuthStore.registerHandler()
		if (AuthStore.token) {
			navigate('/products')
		}
	}

	return (
		<>
			<h3 className={`container-fluid ${styles.auth}`}>{lang.appTitle}</h3>
			<Form className={`container-fluid ${styles.authForm}`}>
				<Form.Group className="mb-3">
					<Form.Label><div className='required'/>{lang.inputEmailLabel}</Form.Label>
					{ !AuthStore.email.valid && <p className='hint-warning'>{lang.inputEmailErrorMsg}</p> }
					<Form.Control
						type="email"
						value={AuthStore.email.value}
						onChange={event => AuthStore.onChangeEmailHandler(event.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label><div className='required'/>{lang.inputPasswordLabel}</Form.Label>
					<p className='hint'>{lang.inputPasswordHelpText}</p>
					{ !AuthStore.password.valid && <p className='hint-warning'>{lang.inputPasswordErrorMsg}</p> }
					<Form.Control
						type="password"
						value={AuthStore.password.value}
						onChange={event => AuthStore.onChangePasswordHandler(event.target.value)}
					/>
				</Form.Group>
				{
					AuthStore.error ? <div className={styles.error}>{lang.signInError}</div> : null
				}
				<Stack direction='horizontal'>
					<Button
						variant='light'
						onClick={() => handleSubmit(true)}
						disabled={!AuthStore.isFormValid}
					>
						{lang.signIn}
					</Button>
					<Button
						variant='light'
						onClick={() => handleSubmit(false)}
						disabled={!AuthStore.isFormValid}
					>
						{lang.signUp}
					</Button>
					<Button
						className='ms-auto'
						variant='light'
						onClick={() => AuthStore.onResetPassword()}
						disabled={!AuthStore.email.valid}
					>
						{lang.resetPassword}
					</Button>
				</Stack>
			</Form>

			<ModalWindow
				show={AuthStore.isResetModalWindowOpen}
				title={lang.resetPasswordTitle}
				onClose={() => AuthStore.onCloseWindow()}
				hideFooter={true}
			>
				{lang.resetPasswordInfo}
			</ModalWindow>
		</>
	)
}))

export default Auth