import {makeAutoObservable} from "mobx";

export class Category {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    name = ''

    init = ({id, name}) => {
        this.id = id
        this.name = name
    }

    clear = () => {
        this.id = null
        this.name = ''
    }

    checkRequiredFields = () => !!this.name?.trim()
}
