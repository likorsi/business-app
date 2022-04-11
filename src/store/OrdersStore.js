import {action, makeAutoObservable, observable, when} from "mobx";
import OrdersService from "../service/OrdersService";
import ProductsService from "../service/ProductsService";
import AuthService from "../service/AuthService";
import {Order} from "../domain/Order";
import {lang} from "../lang";

class OrdersStore {

    constructor() {
        makeAutoObservable(this)
    }

    @observable isModifyWindowOpen = false
    @observable isDeleteWindowOpen = false
    @observable isShowWindowOpen = false

    @observable isShowIncomeWindowOpen = false
    @observable incomePrompt = false
    @observable isShowNalogIncomeToast = false
    @observable isShowRejectIncomeToast = false
    @observable receiptUrl = ''
    @observable incomeNumber = ''
    @observable addIncome = true
    @observable rejectReason = lang.rejectReason.return

    @observable isShowToast = false
    @observable toastText = ''
    @observable toastStatus = false
    @observable loading = false
    @observable error = false

    @observable orders = []
    @observable rawOrders = []
    @observable products = []
    @observable rawProducts = []
    @observable newOrder = new Order()

    @observable filters = {
        checkedStatuses: [],
        searchText: '',
        searching: false
    }

    @observable searchProductText = ''

    @observable nalogInfo = {
        useMyNalogOption: false,
        refreshToken: '',
        incomeName: '',
        inn: '',
        deviceId: ''
    }

    get statuses() {
        return new Array(7)
            .fill(0)
            .map( (_, i) => ({id: (i+1).toString(), name: lang.orderStatus[i+1]}))
    }

    @action onCloseWindow = () => {
        this.isDeleteWindowOpen = false
        this.isModifyWindowOpen = false
        this.isShowWindowOpen = false
        this.newOrder.clear()
    }

    searchProduct = () => {
        this.products = !this.searchProductText.trim()
            ? [...this.rawProducts]
            : this.rawProducts.filter(product => product.name.toLowerCase().includes(this.searchProductText.toLowerCase().trim()))
    }

    addToOrder = id => {
        this.newOrder.products[id]
            ? (this.newOrder.products[id] += 1)
            : (this.newOrder.products[id] = 1)
    }

    removeFromOrder = id => {
        this.newOrder.products[id] -= 1
        this.newOrder.products[id] === 0 && delete this.newOrder.products[id]
    }

    getProductCountInOrder = id => this.newOrder.products[id] || 0

    getProductsList = () => {
        const keys = Object.keys(this.newOrder.products)
        let amount = 0
        const productsList = keys.map(key => {
            const product = this.rawProducts.find(({id}) => id === key)
            amount += Number(product.price) * this.newOrder.products[key]
            return {id: key, name: product.name, count: this.newOrder.products[key]}
        })
        this.newOrder.amount = amount
        return productsList
    }

    beautifyDate = date => {
        const d = new Date(date)
        return d.toLocaleDateString()
    }

    @action filterOrders = () => {
        this.filters.searchText = this.filters.searchText.trim()
        this.orders = !this.filtersUsed
            ? [...this.rawOrders]
            : this.rawOrders
                .filter(order => this.filters.checkedStatuses.includes(order.status.toString()))
                .filter(order => this.filters.searchText
                    ? order.client.toLowerCase().includes(this.filters.searchText)
                        || order.amount.toString().toLowerCase().includes(this.filters.searchText)
                        || order.inn.toString().includes(this.filters.searchText)
                        || order.address.address.toLowerCase().includes(this.filters.searchText)
                        || order.address.country.toLowerCase().includes(this.filters.searchText)
                        || order.address.city.toLowerCase().includes(this.filters.searchText)
                        || this.beautifyDate(order.dateCreate).includes(this.filters.searchText)
                    : true
                )
    }

    get filtersUsed() {
        return this.filters.searching || this.filters.checkedStatuses.length !== this.statuses.length
    }

    updateOrders = async () => {
        this.rawOrders = OrdersService.getOrders()
        this.filterOrders()
    }

    @action onModifyOrder = async () => {
        await OrdersService.createOrUpdateOrder(this.newOrder)
        this.error = OrdersService.getError()
        this.toastText = this.error ? lang.errorCreateOrder : lang.successCreateOrder
        this.isShowToast = true
        if (!this.error) {
            await this.updateOrders()
            this.onCloseWindow()
        }
    }

    @action onDeleteOrder = async () => {
        await OrdersService.deleteOrder(this.newOrder.id)
        this.error = OrdersService.getError()
        this.toastText = this.error ? lang.errorDeleteOrder : lang.successDeleteOrder
        this.isShowToast = true
        if (!this.error) {
            await this.updateOrders()
            this.onCloseWindow()
        }
    }

    onUpdateStatus = async (id, status) => {
        await OrdersService.updateStatus(id, status)
        this.error = OrdersService.getError()
        this.toastText = this.error ? lang.errorCreateOrder : lang.successCreateOrder
        const order = this.rawOrders.find(order => order.id === id)
        this.incomeNumber = order.orderNumber
        this.receiptUrl = order.receiptUrl

        if (status === '7' && !this.error) {
            this.addIncome = false
            this.incomePrompt = false
            this.isShowIncomeWindowOpen = true
            await when(() => !this.isShowIncomeWindowOpen)
            if (this.incomePrompt) {
                await OrdersService.rejectIncome(id, this.rejectReason)
                this.error = OrdersService.getError()
            }
        }

        if (status === '3'&& !this.error) {
            this.addIncome = true
            this.incomePrompt = false
            this.isShowIncomeWindowOpen = true
            await when(() => !this.isShowIncomeWindowOpen)
            if (this.incomePrompt) {
                await OrdersService.addIncome(id)
                this.nalogInfo = AuthService.getNalogInfo()
                this.error = OrdersService.getError()
            }
        }

        if (!this.incomePrompt) {
            this.isShowToast = true
            await this.updateOrders()
        }

        if (this.incomePrompt && !this.error) {
            status === '3' && (this.isShowNalogIncomeToast = true)
            status === '7' && (this.isShowRejectIncomeToast = true)
            await this.updateOrders()
        }

        if (this.incomePrompt && this.error) {
            this.toastText = lang.errorModifyIncome
            this.isShowToast = true
        }
    }

    @action onInit = async () => {
        this.isShowToast = false
        this.isShowNalogIncomeToast = false
        this.isShowRejectIncomeToast = false
        this.loading = true
        await OrdersService.loadOrders()
        this.rawOrders = OrdersService.getOrders()
        this.orders = [...this.rawOrders]
        this.filters.checkedStatuses = this.statuses.map(({id}) => id)
        await ProductsService.loadProducts()
        this.rawProducts = ProductsService.getProducts()
        this.products = [...this.rawProducts]
        this.nalogInfo = AuthService.getNalogInfo()
        this.loading = false
    }

}

export default new OrdersStore()