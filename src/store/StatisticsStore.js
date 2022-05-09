import {computed, makeAutoObservable, observable} from "mobx";
import StatisticsService from "../service/StatisticsService";
import AuthService from "../service/AuthService";

class StatisticsStore {
    constructor() {
        makeAutoObservable(this)
    }

    @observable loading = false
    @observable nalogInfo = {}
    @observable taxToPay = 0
    @observable topProductsData = []
    @observable ordersData = []
    @observable incomeData = []
    @observable mainInfo = {
        allOrders: 0,
        canceledOrders: 0,
        finishedOrders: 0,
        otherOrders: 0,
        allIncome: 0
    }

    filterStatistics = period => {
        [this.topProductsData, this.ordersData, this.incomeData] = StatisticsService.getStatistics(period)
        // console.log(this.incomeData)
    }

    @computed get isNotEnoughData() {
        return this.topProductsData.length === 0
    }

    onInit = async () => {
        this.loading = true
        await StatisticsService.loadInfo()
        await AuthService.loadMyNalogOption()
        this.nalogInfo = StatisticsService.getNalogInfo()
        this.nalogInfo.useMyNalogOption && (this.taxToPay = await StatisticsService.getTax())
        this.filterStatistics('all')
        this.mainInfo = StatisticsService.getMainInfo()
        this.loading = false
    }
}

export default new StatisticsStore()