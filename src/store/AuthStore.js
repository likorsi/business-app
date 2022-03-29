import {action, computed, makeAutoObservable, observable} from "mobx";

import AuthService from "../service/AuthService.js";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {lang} from "../lang";
import {Photo} from "../domain/Photo";

class AuthStore {
    constructor() {
        makeAutoObservable(this)
        onAuthStateChanged(getAuth(), (user) => {
            this.profile = user
            if (!user) {
                this.token = null
            } else {
                this.token = localStorage.getItem('token')
                // this.publicUrl = `https://small-business-app/users/${user.uid}`
                this.publicUrl = `/users/${user.uid}`
            }
        });
    }

    @observable profile = null
    @observable publicUrl = null
    @observable nalogInfo = {
        useMyTaxOption: false,
        token: ''
    }
    @observable publicInfo = {
        username: '',
        photo: new Photo(),
        helpText: ''
    }
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

    @observable newName = ''
    @observable newPassword = ''
    @observable newEmail = ''
    @observable newHelpText = ''
    @observable newPhoto = null

    @observable error = null
    @observable token = null
    @observable user = null

    @observable isEditEmailWindowOpen = false
    @observable isEditNameWindowOpen = false
    @observable isEditPasswordWindowOpen = false
    @observable isEditHelpTextWindowOpen = false
    @observable isEditPhotoWindowOpen = false
    @observable isDeletePhotoWindowOpen = false
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
        this.isEditHelpTextWindowOpen = false
        this.isEditPhotoWindowOpen = false
        this.isDeletePhotoWindowOpen = false
        this.isResetModalWindowOpen = false
        this.isLoginToMyTaxWindowOpen = false
        this.email.value = ''
        this.email.touched = false
        this.email.valid = false
        this.password.value = ''
        this.password.touched = false
        this.password.valid = false
        this.newName = ''
        this.newHelpText = ''
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
        await AuthService.updateUsername(this.newName)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.onCloseWindow()
        }
    }

    onEditHelpText = async () => {
        await AuthService.updateHelpText(this.newHelpText.trim())
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.publicInfo = AuthService.getPublicInfo()
            this.onCloseWindow()
        }
    }

    checkImage = (files) => {
        this.newPhoto = [...files]?.filter(file => file.type.includes('image'))[0]
    }

    onEditPhotoUrl = async () => {
        await AuthService.updatePhotoUrl(this.newPhoto)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.publicInfo = AuthService.getPublicInfo()
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

    onResetCheckMyTaxOption = async () => {
        await AuthService.resetCheckMyTaxOption()
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.nalogInfo = AuthService.getNalogInfo()
            this.onCloseWindow()
        }
    }

    onLoginToMyTax = async () => {
        await AuthService.loginToMyTax(this.newEmail, this.newPassword)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.nalogInfo = AuthService.getNalogInfo()
            this.onCloseWindow()
        }
    }

    onInitProfile = async () => {
        this.isShowToast = false
        await AuthService.loadMyTaxOption()
        this.nalogInfo = AuthService.getNalogInfo()
        this.publicInfo = AuthService.getPublicInfo()
    }
}

export default new AuthStore()