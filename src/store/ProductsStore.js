import {action, computed, makeAutoObservable, observable} from "mobx";
import ProductsService from "../service/ProductsService";
import {Product} from "../domain/Product";
import {Category} from "../domain/Category";
import {lang} from "../lang";

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
    @observable loadingNewProduct = false

    @observable categories = []
    @observable sorting = [
        {value: lang.sorting.default, id: 'default'},
        {value: lang.sorting.AZ, id: 'az'},
        {value: lang.sorting.ZA, id: 'za'},
    ]
    @observable products = []
    @observable rawProducts = []
    @observable selected = null
    @observable newCategory = new Category()
    @observable newProduct = new Product()

    @observable filters = {
        sorting: this.sorting[0],
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
                if (this.filters.sorting.id === 'az') {
                    return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0)
                }
                if (this.filters.sorting.id === 'za') {
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
        this.loadingNewProduct = true
        await ProductsService.createOrUpdateProduct(this.newProduct)
        this.loadingNewProduct = false
        this.error = ProductsService.getError()
        this.toastText = this.error ? lang.errorCreateProduct : lang.successCreateProduct
        this.isShowToast = true
        if (!this.error) {
            await this.updateProducts()
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
            await this.updateProducts()
            this.onCloseWindow()
        }
    }

    get filtersUsed() {
        return this.filters.checkedCategories.length !== this.categories.length + 1
    }

    @action onInit = async () => {
        this.isShowToast = false
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