import React from "react";
import styles from './Button.module.scss'

export const Button = props => {
	
	return (
		<button
			onClick={props.onClick}
			className={`btn btn-${props.type || ''} ${props.visibility || ''} ${styles.Button} ${props.styles || ''}`}
			disabled={props.disabled || false}
		>

			{props.children}
		</button>
	)
}