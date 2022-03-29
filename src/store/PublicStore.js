import {action, computed, makeAutoObservable, observable} from "mobx";
import {Product} from "../domain/Product";
import PublicService from "../service/PublicService";
import {Order} from "../domain/Order";
import {Photo} from "../domain/Photo";

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
        sorting: null,
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
                if (this.filters.sorting === 'az') {
                    return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0)
                }
                if (this.filters.sorting === 'za') {
                    return a.name > b.name ? -1 : (a.name < b.name ? 1 : 0)
                }
                return 0
            })
    }

    get filtersUsed() {
        return this.filters.checkedCategories.length === this.categories.length + 1
    }

    @action addToCart = (product) => {
        this.order.products[product.id]
            ? (this.order.products[product.id] += 1)
            : (this.order.products[product.id] = 1)
    }

    @action removeFromCart = (product) => {
        this.order.products[product.id] -= 1
        this.order.products[product.id] === 0 && delete this.order.products[product.id]
    }

    clearCart = () => {
        this.order.products = []
    }

    getProductCountInCart(id) {
        return this.order.products[id] || 0
    }

    createOrder = () => {
        this.order.clear()
        this.onCloseWindow()
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