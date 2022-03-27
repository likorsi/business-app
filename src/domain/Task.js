import {makeAutoObservable} from "mobx";

export class Task {
    constructor() {
        makeAutoObservable(this)
    }

    id = null
    task = ''
    done = false

    init = ({id, task, done}) => {
        this.id = id
        this.task = task
        this.done = done
    }

    clear = () => {
        this.id = null
        this.task = ''
        this.done = false
    }

    check = () => {
        this.done = !this.done
    }

    checkRequiredFields = () => !!this.task?.trim()
}
