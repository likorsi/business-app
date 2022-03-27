import {makeAutoObservable, observable} from "mobx";

class OrdersStore {

    constructor() {
        makeAutoObservable(this)
    }

    @observable orders = []

    onInit = () => {

    }

}

export default new OrdersStore()