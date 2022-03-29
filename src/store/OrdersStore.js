import {action, makeAutoObservable, observable} from "mobx";
import {lang} from "../lang";
import OrdersService from "../service/OrdersService";
import {Order} from "../domain/Order";

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
    @observable newOrder = new Order()

    @observable filters = {
        sorting: null,
        checkedStatuses: [],
        searchText: ''
    }

    get statuses() {
        return new Array(7)
            .fill(0)
            .map( (_, i) => ({id: i.toString(), name: lang.orderStatus[i]}))
    }

    @action onCloseWindow = () => {
        this.isDeleteWindowOpen = false
        this.isModifyWindowOpen = false
        this.isShowWindowOpen = false
        this.newOrder.clear()
    }

    filterOrders = () => {
        this.orders = [...this.rawOrders]
    }

    get filtersUsed() {
        return !this.filters.searchText.trim() || this.filters.checkedStatuses.length === this.statuses.length
    }

    updateOrders = async () => {
        // await OrdersService.loadOrders()
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

    get checkedAllOrders() {
        return true
    }

    @action onInit = async () => {
        this.isShowToast = false
        this.loading = true
        await OrdersService.loadOrders()
        this.rawOrders = OrdersService.getOrders()
        this.orders = [...this.rawOrders]
        this.filters.checkedStatuses = this.statuses.map(({id}) => id)
        this.loading = false
    }

}

export default new OrdersStore()