import {action, makeAutoObservable, observable} from "mobx";
import {lang} from "../lang";

class ProductsStore {

    constructor() {
        makeAutoObservable(this)
    }

    @observable isDeleteWindowOpen = false
    @observable isEditWindowOpen = false

    @observable isShowToast = false
    @observable toastText = ''
    @observable toastStatus = false

    @observable loading = true
    @observable checkedCategories = []
    @observable categories = [{id:'1', name:'one'},{id:'2', name:'two'},{id:'3', name:'three'}]
    @observable products = [{id: 1, name: 'one', description: 'kjn'}, {id:2, name: 'two'}, {id:3, name: 'three'}, {id:4, name: 'four'}]
    @observable selectedProduct = ''

    hideToast = () => {
        this.isShowToast = false
    }

    onCloseWindow = () => {
        this.isDeleteWindowOpen = false
        this.isEditWindowOpen = false
    }

    handleDeleteWindow = (selected) => {
        this.selectedProduct = selected
        this.isDeleteWindowOpen = true
    }

    onDeleteProduct = () => {
        this.isDeleteWindowOpen = false
        this.toastText = lang.successDeleteProduct
        this.toastStatus = true
        this.isShowToast = true

    }

    handleEditWindow = (selected) => {
        this.selectedProduct = selected
        this.isEditWindowOpen = true
    }

}

export default new ProductsStore()