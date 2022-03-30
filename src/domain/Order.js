import {makeAutoObservable} from "mobx";
import {lang} from "../lang";

export class Order {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    orderNumber = ''
    client = ''
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

    init = ({id, client, create, edit, products, amount, description, orderNumber, status, delivery, address, orderForEntity, inn, receiptUrl}) => {
        this.id = id
        this.client = client
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
    }

    clear = () => {
        this.id = null
        this.client = ''
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
        && (this.orderForEntity ? this.checkInn() : true)
        && (this.delivery ? !!this.address.address.trim() : true)

    checkInn = () => {
        const re10 = /^[\d+]{10}$/
        const re12 = /^[\d+]{12}$/
        return !this.inn.trim() || re10.test(this.inn) || re12.test(this.inn)
    }
}
