import {action, computed, makeAutoObservable, observable} from "mobx";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import AuthService from "../service/AuthService.js";
import {Photo} from "../domain/Photo";
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
                // this.publicUrl = `https://small-business-app/users/${user.uid}`
                this.publicUrl = `/users/${user.uid}`
            }
        });
    }

    @observable profile = null
    @observable publicUrl = null
    @observable nalogInfo = {
        useMyNalogOption: false,
        refreshToken: '',
        incomeName: '',
        inn: '',
        deviceId: ''
    }
    @observable publicInfo = {
        username: '',
        photo: new Photo(),
        helpText: ''
    }

    @observable password = {
        value: '',
        valid: true,
        touched: false
    }

    @observable email = {
        value: '',
        valid: true,
        touched: false
    }

    @observable newName = ''
    @observable newPassword = ''
    @observable newEmail = ''
    @observable newHelpText = ''
    @observable newPhoto = null
    @observable newIncomeName = ''

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
    @observable isLoginToMyNalogWindowOpen = false
    @observable isEditIncomeNameWindowOpen = false

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
        this.password.touched = false
        this.email.touched = false
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
        this.isLoginToMyNalogWindowOpen = false
        this.isEditIncomeNameWindowOpen = false
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
        await AuthService.updateUserEmail(this.newEmail, this.password.value)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.profile = getAuth().currentUser
            this.onCloseWindow()
        }
    }

    onEditPassword = async () => {
        await AuthService.updateUserPassword(this.newPassword, this.password.value)
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
        await AuthService.deleteUserAccount(this.password.value)
        this.error = AuthService.getError()
        if (this.error) {
            this.toastText = lang.errorDeleteAccount
            this.isShowToast = true
        } else {
            this.password.touched = false
            this.email.touched = false
            this.token = null
            localStorage.removeItem('token')
        }
    }

    onResetCheckMyNalogOption = async () => {
        await AuthService.resetCheckMyNalogOption()
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.nalogInfo = AuthService.getNalogInfo()
            this.onCloseWindow()
        }
    }

    onLoginToMyNalog = async () => {
        await AuthService.loginToMyNalog(this.newEmail, this.newPassword)
        this.error = AuthService.getError()
        this.toastText = this.error ? lang.errorSaveUserData : lang.successSaveUserData
        this.isShowToast = true
        if (!this.error) {
            this.nalogInfo = AuthService.getNalogInfo()
            this.onCloseWindow()
        }
    }

    onEditIncomeName = async () => {
        await AuthService.editIncomeName(this.newIncomeName)
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
        await AuthService.loadMyNalogOption()
        this.nalogInfo = AuthService.getNalogInfo()
        this.publicInfo = AuthService.getPublicInfo()
    }
}

export default new AuthStore()