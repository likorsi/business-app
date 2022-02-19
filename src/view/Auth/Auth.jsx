import React from "react";
import styles from './Auth.module.scss'
import Input from '../../components/UI/Input/Input'
import {observer, inject} from "mobx-react";
import {lang} from "../../lang";
import {useNavigate} from 'react-router-dom'

const Auth = inject("AuthStore")(observer(({AuthStore}) => {

	let navigate = useNavigate();

	function handleSubmit(isLogin) {
		isLogin ? AuthStore.loginHandler() : AuthStore.registerHandler()
		console.log(AuthStore.token)
		if (AuthStore.token) {
			navigate('/', { replace: true })
		}
	}

	return (
		<>
			<h3 className={`container-fluid ${styles.auth}`}>{lang.appTitle}</h3>
			<div className={`container-fluid ${styles.authForm}`}>
				<form onSubmit={ event => {event.preventDefault()}} >
					<Input
						key='email'
						type='email'
						value={AuthStore.formControls.email.value}
						valid={AuthStore.formControls.email.valid}
						touched={AuthStore.formControls.email.touched}
						label={lang.inputEmailLabel}
						shouldValidate={!!AuthStore.formControls.email.validation}
						errorMsg={lang.inputEmailErrorMsg}
						onChange={event => AuthStore.onChangeHandler(event.target.value, 'email')}
					/>
					<Input
						key='password'
						type='password'
						value={AuthStore.formControls.password.value}
						valid={AuthStore.formControls.password.valid}
						touched={AuthStore.formControls.password.touched}
						label={lang.inputPasswordLabel}
						shouldValidate={!!AuthStore.formControls.password.validation}
						helpText={lang.inputPasswordHelpText}
						errorMsg={lang.inputPasswordErrorMsg}
						onChange={event => AuthStore.onChangeHandler(event.target.value, 'password')}
					/>

				  {
					  AuthStore.error ? <div className={styles.error}>{lang.signInError}</div> : null
				  }

				  <button
					className="btn btn-light"
					onClick={() => handleSubmit(true)}
					disabled={!AuthStore.isFormValid}
				  >{lang.signIn}</button>
				  <button
					className="btn btn-light"
					onClick={() => AuthStore.registerHandler()}
					disabled={!AuthStore.isFormValid}
				  >{lang.signUp}</button>
				</form>
			</div>
		</>
	)
}))

export default Auth