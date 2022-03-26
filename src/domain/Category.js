import {makeAutoObservable} from "mobx";

export class Category {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    name = null

    init = ({id, name}) => {
        this.id = id
        this.name = name
    }

    clear = () => {
        this.id = null
        this.name = null
    }

    checkRequiredFields = () => !!this.name?.trim()
}
