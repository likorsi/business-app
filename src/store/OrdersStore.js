import {action, makeAutoObservable, observable} from "mobx";
import {lang} from "../lang";
import OrdersService from "../service/OrdersService";
import {Order} from "../domain/Order";
import ProductsService from "../service/ProductsService";

class OrdersStore {

    constructor() {
        makeAutoObservable(this)
    }

    @observable isModifyWindowOpen = false
    @observable isDeleteWindowOpen = false
    @observable isShowWindowOpen = false

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
        sorting: null,
        checkedStatuses: [],
        searchText: '',
        searching: false
    }

    @observable searchProductText = ''

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
        console.log(this.filtersUsed)
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
                .sort((a, b) => {
                    if (this.filters.sorting === 'edit') {
                        return a.dateEdit > b.dateEdit ? 1 : (a.dateEdit < b.dateEdit ? -1 : 0)
                    }
                    return 0
                })
    }

    get filtersUsed() {
        return this.filters.sorting === 'edit' || this.filters.searching || this.filters.checkedStatuses.length !== this.statuses.length
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
        this.isShowToast = true
        if (!this.error) {
            await this.updateOrders()
            this.onCloseWindow()
        }
    }

    @action onInit = async () => {
        this.isShowToast = false
        this.loading = true
        await OrdersService.loadOrders()
        this.rawOrders = OrdersService.getOrders()
        this.orders = [...this.rawOrders]
        this.filters.checkedStatuses = this.statuses.map(({id}) => id)
        await ProductsService.loadProducts()
        this.rawProducts = ProductsService.getProducts()
        this.products = [...this.rawProducts]
        this.loading = false
        console.log(this.rawOrders)
    }

}

export default new OrdersStore()