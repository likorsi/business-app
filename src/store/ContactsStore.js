import {action, makeAutoObservable, observable} from "mobx";
import ContactsService from "../service/ContactsService";
import {Contact} from "../domain/Contact";
import {lang} from "../lang";

class ContactsStore {

    constructor() {
        makeAutoObservable(this)
    }

    @observable isModifyWindowOpen = false
    @observable isDeleteWindowOpen = false

    @observable isShowToast = false
    @observable toastText = ''
    @observable toastStatus = false
    @observable loading = false
    @observable error = false

    @observable contacts = []
    @observable newContact = new Contact()

    @action onCloseWindow = () => {
        this.isDeleteWindowOpen = false
        this.isModifyWindowOpen = false
        this.newContact.clear()
    }

    updateContacts = async () => {
        await ContactsService.loadContacts()
        this.contacts = ContactsService.getContacts()
    }

    @action onModifyContact = async () => {
        await ContactsService.createOrUpdateContact(this.newContact)
        this.error = ContactsService.getError()
        this.toastText = this.error ? lang.errorCreateContact : lang.successCreateContact
        this.isShowToast = true
        if (!this.error) {
            await this.updateContacts()
            this.onCloseWindow()
        }
    }

    @action onDeleteContact = async () => {
        await ContactsService.deleteContact(this.newContact.id)
        this.error = ContactsService.getError()
        this.toastText = this.error ? lang.errorDeleteContact : lang.successDeleteContact
        this.isShowToast = true
        if (!this.error) {
            await this.updateContacts()
            this.onCloseWindow()
        }
    }

    @action onInit = async () => {
        this.isShowToast = false
        this.loading = true
        await ContactsService.loadContacts()
        this.contacts = ContactsService.getContacts()
        this.loading = false
    }

}

export default new ContactsStore()