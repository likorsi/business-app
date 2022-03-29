import {makeAutoObservable} from "mobx";

export class Photo {
    constructor() {
        makeAutoObservable(this)
    }

    name = ''
    fullPath = ''
    src = ''
    forRemove = false
    new = false

    init = ({src, fullPath, name}) => {
        this.name = name
        this.fullPath = fullPath
        this.src = src
    }

    checkNew = flag => {
        this.new = !!flag
    }

    checkForRemove = flag => {
        this.forRemove = !!flag
    }

    getPhotoToLoad = () => ({
        src: this.src,
        fullPath: this.fullPath,
        name: this.name
    })


    clear = () => {
        this.name = ''
        this.fullPath = ''
        this.src = ''
    }
}