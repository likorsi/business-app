import {makeAutoObservable, observable} from "mobx";

class StatisticsStore {
    constructor() {
        makeAutoObservable(this)
    }

    @observable loading = false

    filterStatistics = eventKey => {
        console.log(eventKey)
    }

    onInit = async () => {

    }
}

export default new StatisticsStore()