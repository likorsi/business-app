import {makeAutoObservable} from "mobx";

export class Order {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    client = ''
    products = []
    amount = 0
    description = ''

    init = ({id, client, products, amount, description}) => {
        this.id = id
        this.client = client
        this.products = products || []
        this.amount = amount || 0
        this.description = description || ''
    }

    clear = () => {
        this.id = null
        this.client = ''
        this.products = []
        this.amount = 0
        this.description = ''
    }

    checkRequiredFields = () => !!this.client?.trim() && this.products.length > 0
}
