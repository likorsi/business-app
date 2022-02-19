import React from 'react'
import styles from'./Input.module.scss'
import {observer} from "mobx-react";

function isInvalid({valid, touched, shouldValidate}) {
	return !valid && shouldValidate && touched
}

const Input = props => {

	const inputType = props.type || 'text'
	const style = [styles.Input]
	const htmlFor = `${inputType}-${Math.random()}`

	if (isInvalid(props)) {
		style.push(styles.invalid)
	}

	return (
		<div className={`${style.join(' ')} mb-3`}>
			<label htmlFor={htmlFor} className="form-label">{props.label}</label>
			<input 
				className={`${!!props.style ? props.style.join(' ') : ''} form-control`}
				type={inputType}
				id={htmlFor}
				value={props.value}
				onChange={props.onChange}
				aria-describedby={'help'+htmlFor}
			/>
			{
				!!props.helpText
				? <div id={'help'+htmlFor} className="form-text">{props.helpText}</div>
				: null
			}

			{
				isInvalid(props) 
				? <span>{props.errorMsg || 'Введите верное значение'}</span>
				: null
			}
			
		</div>
	)
}

export default Input