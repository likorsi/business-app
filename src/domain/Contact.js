import {makeAutoObservable} from "mobx";

export class Contact {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    name = ''
    phone = ''
    description = ''

    init = ({id, name, phone, description}) => {
        this.id = id
        this.name = name
        this.phone = phone
        this.description = description || ''
    }

    clear = () => {
        this.id = null
        this.name = ''
        this.phone = ''
        this.description = ''
    }

    validatePhone = () => {
        const re = /^(\+7|8)[\s(-]{0,2}(\d{3})[\s)-]{0,2}(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})$/g;
        return !this.phone.trim() || re.test(this.phone.trim())
    }

    get beautifulPhone() {
        const regex = /(\+7|8)(\d{3})(\d{3})(\d{2})(\d{2})/g
        const subst = "$1 ($2) $3-$4-$5"
        return this.phone.replace(regex, subst)
    }

    get replacePhone() {
        const tel = this.phone.replace(/\D/g, '')
        return this.phone.startsWith('+') ? '+' + tel : tel
    }

    checkRequiredFields = () => !!this.name?.trim() && this.validatePhone()
}
