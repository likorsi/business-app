import {makeAutoObservable} from "mobx";

export class Order {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    orderNumber = ''
    client = ''
    products = {}
    amount = 0
    description = ''
    status = 0

    init = ({id, client, products, amount, description, orderNumber, status}) => {
        this.id = id
        this.client = client
        this.products = products || {}
        this.amount = amount || 0
        this.description = description || ''
        this.orderNumber = orderNumber
        this.status = status || 0
    }

    clear = () => {
        this.id = null
        this.client = ''
        this.products = {}
        this.amount = 0
        this.description = ''
        this.orderNumber = ''
        this.status = 0
    }

    checkRequiredFields = () => !!this.client?.trim() && this.products.length > 0

}
