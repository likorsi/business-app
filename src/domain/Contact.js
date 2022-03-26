import {makeAutoObservable} from "mobx";

export class Contact {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    name = null
    phone = null
    description = null

    init = ({id, name, phone, description}) => {
        this.id = id
        this.name = name
        this.phone = phone
        this.description = description
    }

    clear = () => {
        this.id = null
        this.name = null
        this.phone = null
        this.description = null
    }

    validatePhone = () => {
        const re = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
        return re.test(this.phone?.trim())
    }

    get replacePhone() {
        let tel = this.phone.replace(/\D/g, '')
        return tel.startsWith('7') ? '+' + tel : tel
    }

    checkRequiredFields = () => !!this.name?.trim() && this.validatePhone()
}
