import {makeAutoObservable} from "mobx";
import {lang} from "../lang";

export class Order {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    orderNumber = ''
    client = ''
    clientPhone = ''
    orderForEntity = false
    inn = ''
    products = {}
    amount = 0
    description = ''
    status = 1
    dateCreate = ''
    dateEdit = ''
    delivery = true
    address = {
        country: lang.russia,
        city: '',
        address: ''
    }
    receiptUrl = ''
    receiptId = ''

    init = ({id, client, clientPhone, create, edit, products, amount, description, orderNumber, status, delivery, address, orderForEntity, inn, receiptUrl, receiptId}) => {
        this.id = id
        this.client = client
        this.clientPhone = clientPhone || ''
        this.products = products || {}
        this.amount = amount || 0
        this.description = description || ''
        this.orderNumber = orderNumber
        this.status = status || 1
        this.dateCreate = create || ''
        this.dateEdit = edit || ''
        this.delivery = delivery
        this.address = address || {}
        this.orderForEntity = orderForEntity
        this.inn = inn
        this.receiptUrl = receiptUrl || ''
        this.receiptId = receiptId || ''
    }

    clear = () => {
        this.id = null
        this.client = ''
        this.clientPhone = ''
        this.products = {}
        this.amount = 0
        this.description = ''
        this.orderNumber = ''
        this.status = 1
        this.dateCreate = ''
        this.dateEdit = ''
        this.delivery = true
        this.address = {
            country: lang.russia,
            city: '',
            address: ''
        }
        this.orderForEntity = false
        this.inn = ''
        this.receiptUrl = ''
        this.receiptId = ''
    }

    clearAddress = () => {
        this.address = {
            country: '',
            city: '',
            address: lang.order.pickup
        }

        return this.address
    }

    getAddress = () => {
        return `${this.address.country}, ${this.address.city}, ${this.address.address}`
    }

    checkRequiredFields = () => Object.keys(this.products).length > 0
        && this.client.trim()
        && this.checkPhone()
        && (this.orderForEntity ? this.checkInn() : true)
        && (this.delivery ? !!this.address.address.trim() : true)

    checkInn = () => {
        const re10 = /^[\d+]{10}$/
        const re12 = /^[\d+]{12}$/
        return !this.inn.trim() || re10.test(this.inn) || re12.test(this.inn)
    }

    checkPhone = () => {
        const re = /^(\+7|8)[\s(-]{0,2}(\d{3})[\s)-]{0,2}(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})$/g;
        return !this.clientPhone.trim() || re.test(this.clientPhone.trim())
    }

    get beautifulPhone() {
        const regex = /(\+7|8)(\d{3})(\d{3})(\d{2})(\d{2})/g
        const subst = "$1 ($2) $3-$4-$5"
        return this.clientPhone.replace(regex, subst)
    }

    get replacePhone() {
        const tel = this.clientPhone.replace(/\D/g, '')
        return this.clientPhone.startsWith('+') ? '+' + tel : tel
    }
}
