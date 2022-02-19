import {action, makeAutoObservable, observable} from "mobx";

import AuthService from "../service/AuthService.js";

class AuthStore {

    constructor() {
        makeAutoObservable(this)
    }

    @observable isFormValid = true
    @observable formControls = {
        email: {
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true,
                email: true,
            }
        },
        password: {
            value: '',
            valid: false,
            touched: false,
            validation: {
                required: true,
                password: true
            }
        },
    }
    @observable error = null
    @observable token = null

    updateData = () => {
        this.error = AuthService.getError()
        this.token = AuthService.getToken()
    }

    @action loginHandler = async () => {
        await AuthService.auth(
            this.formControls.email.value,
            this.formControls.password.value,
            true
        )
        this.updateData()
    }

    @action registerHandler = async () => {
        await AuthService.auth(
            this.formControls.email.value,
            this.formControls.password.value,
            false
        )
        this.updateData()
    }

    @action logout = () => {
        AuthService.logout()
        this.updateData()
    }

    @action autoLogin = () => {
        AuthService.autoLogin()
        this.updateData()
    }

    validateControl(value, validation) {
        let isValid = true

        if (validation.required) {
            isValid = value.trim() !== '' && isValid
        }

        if (validation.email) {
            let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
            isValid = re.test(value.toLowerCase()) && isValid
        }

        if (validation.password) {
            // let re = /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/
            let re = /^[0-9a-zA-Z]{6,}$/
            isValid = re.test(value) && isValid
        }

        if (validation.minLength) {
            isValid = value.length >= validation.minLength && isValid
        }

        return isValid
    }

    @action onChangeHandler = (value, controlName) => {
        const control = this.formControls[controlName]

        control.value = value
        control.touched = true
        control.validation && (control.valid = this.validateControl(control.value, control.validation))

        this.formControls[controlName] = control
        this.isFormValid = true

        Object.keys(this.formControls).forEach(name => {
            this.isFormValid = this.formControls[name].valid && this.isFormValid
        })
    }
}

export default new AuthStore()