import {action, computed, makeAutoObservable, observable} from "mobx";
import {lang} from "../lang";
import ProductsService from "../service/ProductsService";
import {Product} from "../domain/Product";
import {Category} from "../domain/Category";

class ProductsStore {

    constructor() {
        makeAutoObservable(this)
    }

    @observable isModifyProductWindowOpen = false
    @observable isModifyCategoryWindowOpen = false
    @observable isDeleteWindowOpen = false
    @observable isShowProductWindowOpen = false

    @observable isShowToast = false
    @observable toastText = ''
    @observable toastStatus = false
    @observable loading = false

    @observable categories = []
    @observable products = []
    @observable rawProducts = []
    @observable selected = null
    @observable newCategory = new Category()
    @observable newProduct = new Product()

    @observable filters = {
        sorting: null,
        checkedCategories: [],
    }

    @computed get isSelectedProduct() {
        return this.selected instanceof Product
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

    @action updateCategories = async () => {
        this.categories = ProductsService.getCategories()
        this.filters.checkedCategories = this.categories.map(({id}) => id).concat('0')

    }

    @action updateProducts = async () => {
        await ProductsService.loadProducts()
        this.rawProducts = ProductsService.getProducts()
        this.filterProducts()
    }

    @action hideToast = () => {
        this.isShowToast = false
    }

    @action onCloseWindow = () => {
        this.isDeleteWindowOpen = false
        this.isModifyProductWindowOpen = false
        this.isShowProductWindowOpen = false
        this.isModifyCategoryWindowOpen = false
        this.selected = null
        this.newProduct.clear()
        this.newCategory.clear()
    }

    @action onModifyCategory = async () => {
        await ProductsService.createCategory(this.newCategory)
        this.error = ProductsService.getError()
        this.toastText = this.error ? lang.errorCreateCategory : lang.successCreateCategory
        this.isShowToast = true
        if (!this.error) {
            await this.updateCategories()
            this.onCloseWindow()
        }
    }

    @action onDeleteCategory = async () => {
        await ProductsService.deleteCategory(this.selected.id)
        this.error = ProductsService.getError()
        this.toastText = this.error ? lang.errorDeleteCategory : lang.successDeleteCategory
        this.isShowToast = true
        if (!this.error) {
            await this.updateCategories()
            this.onCloseWindow()
        }
    }

    @action onModifyProduct = async () => {
        await ProductsService.createProduct(this.newProduct)
        this.error = ProductsService.getError()
        this.toastText = this.error ? lang.errorCreateProduct : lang.successCreateProduct
        this.isShowToast = true
        if (!this.error) {
            this.loading = true
            await this.updateProducts()
            this.loading = false
            this.onCloseWindow()
        }
    }

    @action checkImages = (files) => {
        this.newProduct.isImagesModified = true
        this.newProduct.images = [...files.filter(file => file.type.includes('image'))]
    }

    @action clearImages = () => {
        this.newProduct.isImagesModified = true
        this.newProduct.images = []
    }

    @action onDeleteProduct = async () => {
        await ProductsService.deleteProduct(this.selected.id, this.selected.images)
        this.error = ProductsService.getError()
        this.toastText = this.error ? lang.errorDeleteProduct : lang.successDeleteProduct
        this.isShowToast = true
        if (!this.error) {
            this.loading = true
            await this.updateProducts()
            this.loading = false
            this.onCloseWindow()
        }
    }

    @action addToCart = () => {
        console.log('addToCart: ', this.selected)
    }

    sleep = time => new Promise(r => setTimeout(r, time));

    @action onInit = async () => {
        this.loading = true
        await ProductsService.loadCategories()
        this.categories = ProductsService.getCategories()
        this.filters.checkedCategories = this.categories.map(({id}) => id).concat('0')
        await ProductsService.loadProducts()
        this.rawProducts = ProductsService.getProducts()
        this.products = [...this.rawProducts]
        this.loading = false
    }
}

export default new ProductsStore()