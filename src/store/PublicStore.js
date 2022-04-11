import {action, makeAutoObservable, observable} from "mobx";
import PublicService from "../service/PublicService";
import {Order} from "../domain/Order";
import {Photo} from "../domain/Photo";
import {Product} from "../domain/Product";
import {lang} from "../lang";

class PublicStore {
    constructor() {
        makeAutoObservable(this)
    }

    @observable isCartWindowOpen = false
    @observable isShowProductWindowOpen = false

    @observable isShowToast = false
    @observable toastText = ''
    @observable toastStatus = false
    @observable loading = false

    @observable categories = []
    @observable sorting = [
        {value: lang.sorting.default, id: 'default'},
        {value: lang.sorting.AZ, id: 'az'},
        {value: lang.sorting.ZA, id: 'za'},
    ]
    @observable products = []
    @observable order = new Order()
    @observable rawProducts = []
    @observable publicInfo = {
        username: '',
        photo: new Photo(),
        helpText: ''
    }

    @observable selectedProduct = new Product()

    @observable filters = {
        sorting: this.sorting[0],
        checkedCategories: [],
    }

    @action onCloseWindow = () => {
        this.isCartWindowOpen = false
        this.isShowProductWindowOpen = false
        this.selectedProduct.clear()
    }

    @action filterProducts = () => {
        this.products = this.rawProducts
            .filter(product => this.filters.checkedCategories.length > 0
                ? this.filters.checkedCategories.includes(product.category)
                : false)
            .sort((a, b) => {
                if (this.filters.sorting.id === 'az') {
                    return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0)
                }
                if (this.filters.sorting.id === 'za') {
                    return a.name > b.name ? -1 : (a.name < b.name ? 1 : 0)
                }
                return 0
            })
    }

    get filtersUsed() {
        return this.filters.checkedCategories.length === this.categories.length + 1
    }

    @action addToCart = id => {
        this.order.products[id]
            ? (this.order.products[id] += 1)
            : (this.order.products[id] = 1)
    }

    @action removeFromCart = id => {
        this.order.products[id] -= 1
        this.order.products[id] === 0 && delete this.order.products[id]
    }

    clearCart = () => {
        this.order.products = {}
        this.order.amount = 0
    }

    getProductCountInCart = id => this.order.products[id] || 0

    getProductsList = () => {
        const keys = Object.keys(this.order.products)
        let amount = 0
        const productsList = keys.map(key => {
            const product = this.rawProducts.find(({id}) => id === key)
            amount += Number(product.price) * this.order.products[key]
            return {id: key, name: product.name, count: this.order.products[key]}
        })
        this.order.amount = amount
        return productsList
    }

    createOrder = async () => {
        await PublicService.createOrder(this.order)
        this.error = PublicService.getError()
        this.toastText = this.error ? lang.errorCreateClientOrder : lang.successCreateClientOrder
        this.isShowToast = true
        if (!this.error) {
            this.order.clear()
            this.onCloseWindow()
        }
    }

    @action setStartUrl = startUrl => {
        PublicService.setStartUrl(startUrl)
    }

    @action onInit = async () => {
        this.isShowToast = false
        this.loading = true
        await PublicService.loadCategories()
        this.categories = PublicService.getCategories()
        this.filters.checkedCategories = this.categories.map(({id}) => id).concat('0')
        await PublicService.loadProducts()
        this.rawProducts = PublicService.getProducts()
        this.products = [...this.rawProducts]
        await PublicService.loadPublicInfo()
        this.publicInfo = PublicService.getPublicInfo()
        this.loading = false
    }
}

export default new PublicStore()