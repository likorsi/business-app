import {makeAutoObservable} from "mobx";

export class Product {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    name = ''
    category = ''
    price = ''
    images = []
    badge = ''
    description = ''
    options = []

    isImagesModified = false
    imagesOld = []

    init = ({id, name, category, price, images, badge, description, options}) => {
        this.id = id
        this.name = name
        this.category = category
        this.price = price
        this.images = images || []
        this.badge = badge
        this.description = description
        this.options = options || []
        this.imagesOld = images || []
    }

    clear = () => {
        this.id = null
        this.name = ''
        this.category = ''
        this.price = ''
        this.images = []
        this.badge = ''
        this.description = ''
        this.options = []

        this.isImagesModified = false
        this.imagesOld = []
    }

    get hasMoreInfo() {
        return !!this.description || this.options.length > 0
    }

    checkRequiredFields = () => !!this.name?.trim() && !!this.price && this.price >= 0
}
