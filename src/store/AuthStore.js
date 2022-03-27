import {action, computed, makeAutoObservable, observable} from "mobx";

import AuthService from "../service/AuthService.js";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {lang} from "../lang";

class AuthStore {
    constructor() {
        makeAutoObservable(this)
        onAuthStateChanged(getAuth(), (user) => {
            this.profile = user
            if (!user) {
                this.token = null
            } else {
                this.token = localStorage.getItem('token')
                this.publicUrl = `https://small-business-app/users/${user.uid}`
            }
        });
    }

    @observable profile = null
    @observable publicUrl = null
    @observable useMyTax = false
    @observable useMyTaxChecked = false

    @observable password = {
        value: '',
        valid: false,
        touched: false
    }

    @observable email = {
        value: '',
        valid: false,
        touched: false
    }

    @observable name = ''
    @observable newPassword = ''
    @observable newEmail = ''

    @observable error = null
    @observable token = null
    @observable user = null

    @observable isEditEmailWindowOpen = false
    @observable isEditNameWindowOpen = false
    @observable isEditPasswordWindowOpen = false
    @observable isDeleteAccountWindowOpen = false
    @observable isResetModalWindowOpen = false
    @observable isLoginToMyTaxWindowOpen = false

    @observable isShowToast = false
    @observable toastText = ''
    @observable toastStatus = false

    updateData = () => {
        this.error = AuthService.getError()
        this.token = AuthService.getToken()
        this.profile = AuthService.getProfile()
    }

    @action loginHandler = async () => {
        await AuthService.auth(
            this.email.value.trim(),
            this.password.value.trim(),
            true
        )
        this.updateData()
    }

    @action registerHandler = async () => {
        await AuthService.auth(
            this.email.value.trim(),
            this.password.value.trim(),
            false
        )
        this.updateData()
    }

    @action logout = async () => {
        await AuthService.logout()
        this.updateData()
    }

    @action autoLogin = () => {
        AuthService.autoLogin()
        this.updateData()
    }

    validateEmail = value => {
        let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

        return value.trim() !== '' && re.test(value.toLowerCase())
    }

    validatePassword = value => {
        // let re = /^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/
        let re = /^[0-9a-zA-Z]{6,}$/

        return value.trim() !== '' && re.test(value)
    }

    @action onChangeEmailHandler = value => {
        this.email.value = value
        this.email.touched = true
        this.email.valid = this.validateEmail(value)
    }

    @action onChangePasswordHandler = value => {
        this.password.value = value
        this.password.touched = true
        this.password.valid = this.validatePassword(value)
    }

    @computed get isFormValid() {
        return this.password.valid && this.email.valid
    }

    onCloseWindow = () => {
        this.isDeleteAccountWindowOpen = false
        this.isEditPasswordWindowOpen = false
        this.isEditEmailWindowOpen = false
        this.isEditNameWindowOpen = false
        this.isResetModalWindowOpen = false
        this.isLoginToMyTaxWindowOpen = false
        this.email.value = ''
        this.email.touched = false
        this.email.valid = false
        this.password.value = ''
        this.password.touched = false
        this.password.valid = false
        this.name = ''
        this.newPassword = ''
        this.newEmail = ''
    }

    onResetPassword = async () => {
        await AuthService.resetPassword(this.email.value)
        this.error = AuthService.getError()
        !this.error && (this.isResetModalWindowOpen = true)
    }

    onEditEmail = async () => {
        await AuthService.updateUserEmail(this.newEmail, this.email.value, this.password.value)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.profile = getAuth().currentUser
            this.onCloseWindow()
        }
    }

    onEditPassword = async () => {
        await AuthService.updateUserPassword(this.newPassword, this.email.value, this.password.value)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.profile = getAuth().currentUser
            this.onCloseWindow()
        }
    }

    onEditName = async () => {
        await AuthService.updateUsername(this.name)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.onCloseWindow()
        }
    }

    onDeleteAccount = async () => {
        await AuthService.deleteUserAccount()
        this.error = AuthService.getError()
        if (this.error) {
            this.toastText = lang.errorDeleteAccount
            this.isShowToast = true
        } else {
            this.token = null
            localStorage.removeItem('token')
        }
    }

    onCheckMyTaxOption = async () => {
        await AuthService.updateCheckMyTaxOption(this.useMyTaxChecked)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.useMyTax = AuthService.useMyTax
            this.onCloseWindow()
        }
    }

    onLoginToMyTax = async () => {
        await AuthService.loginToMyTax(this.newEmail, this.newPassword)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.useMyTax = AuthService.useMyTax
            this.onCloseWindow()
        }
    }

    onInitProfile = async () => {
        await AuthService.loadMyTaxOption()
        this.useMyTax = AuthService.useMyTax
    }
}

export default new AuthStore()