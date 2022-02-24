import {makeAutoObservable} from "mobx";

class ContactsStore {

    constructor() {
        makeAutoObservable(this)
    }

}

export default new ContactsStore()