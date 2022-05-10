import {getAuth, onAuthStateChanged} from "firebase/auth";
import NalogAPI from "moy-nalog";
import {child, get, getDatabase, onValue, ref as refDB} from "firebase/database";
import AuthService from "./AuthService";
import {Order} from "../domain/Order";
import {Product} from "../domain/Product";
import {lang} from "../lang";

class StatisticsService {
    constructor() {
        this.error = null
        this.startUrl = localStorage.getItem('userId') || ''
        this.nalogInfo = {
            useMyNalogOption: false,
            refreshToken: '',
            incomeName: '',
            inn: '',
            deviceId: ''
        }
        this.nalogApi = new NalogAPI({autologin: false})
        this.orders = []
        this.products = []
        this.ordersToPeriod = []
        this.colors = [224]

        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                this.startUrl = localStorage.getItem('userId')
                this.nalogInfo = {
                    useMyNalogOption: false,
                    refreshToken: '',
                    incomeName: '',
                    inn: '',
                    deviceId: ''
                }
            } else {

            }
        })

        onValue(refDB(getDatabase(), `${this.startUrl}/nalog`), snapshot => {
            if (snapshot.exists()) {
                this.nalogInfo = snapshot.val()
            }
        });
    }

    getNalogInfo = () => this.nalogInfo

    getTax = async () => {
        try {
            this.error = null

            this.initNalogApi()

            const response = await this.nalogApi.call('incomes/summary')

            return response.totalTaxesToPay

        } catch (e) {
            this.error = e
        }
    }

    initNalogApi = () => {
        const nalogInfo = AuthService.getNalogInfo()
        this.nalogApi.refreshToken = nalogInfo.refreshToken
        this.nalogApi.INN = nalogInfo.inn
        this.nalogApi.sourceDeviceId = nalogInfo.deviceId
        this.nalogApi.authPromise = true
    }

    loadInfo = async () => {
        try {
            this.error = null
            let snapshot = await get(child(refDB(getDatabase()), `${this.startUrl}/orders`))

            if (snapshot.exists()) {
                const data = snapshot.val()
                this.orders = Object.keys(data['data']).map((key) => {
                    const order = new Order()
                    order.init({
                        id: key,
                        ...data['data'][key],
                    })
                    return order
                })
            }

            snapshot = await get(child(refDB(getDatabase()), `${this.startUrl}/products`))

            if (snapshot.exists()) {
                const data = snapshot.val()
                this.products = Object.keys(data).map(key => {
                    const product = new Product()
                    product.init({
                        id: key,
                        name: data[key].name,
                        price: data[key].price
                    })
                    return product
                })
            }
        } catch (e) {
            this.error = e
        }
    }

    getMainInfo = () => {
        return {
            allOrders: this.orders.length,
            canceledOrders: this.orders.filter(order => order.status === '7').length,
            finishedOrders: this.orders.filter(order => order.status === '6').length,
            otherOrders: this.orders.filter(order => !['6', '7'].includes(order.status)).length,
            allIncome: this.orders.filter(({status}) => parseInt(status) >= 3 && status !== '7').reduce((sum, order) => sum + order.amount, 0),
        }
    }

    getStatistics = period => {
        const date = new Date()
        period === 'month' && date.setMonth(date.getMonth() - 1)
        period === 'year' && date.setFullYear(date.getFullYear() - 1)

        this.ordersToPeriod = period === 'all'
            ? [...this.orders]
            : this.orders.filter(order => new Date(order.dateCreate) >= date)

        return [this.getTopProducts(), this.getTopOrders(period), this.getIncome(period)]
    }

    getTopProducts = () => {
        const productsTop = {}
        this.ordersToPeriod.forEach(order => Object.entries(order.products).forEach(([key, value]) => {
            productsTop.hasOwnProperty(key) ? (productsTop[key] += value) : (productsTop[key] = value)
        }))

        return Object.entries(productsTop)
            .sort((a, b) => b[1] - a[1])
            .slice(0,5)
            .map(([id, count], index) => {
                const name = this.products.find(product => product.id === id).name
                return {
                    id: name,
                    label: name,
                    value: count
                }
            })
    }

    getTopOrders = period => {
        const data = []
        const months = Array.from(Array(12).keys())
        const days = Array.from(Array(new Date(this.ordersToPeriod[this.ordersToPeriod.length - 1].dateCreate).getDate()+1).keys()).slice(1)
        const years = period === 'all' ? [...new Set(this.ordersToPeriod.map(({dateCreate}) => new Date(dateCreate).getFullYear()))].sort() : [];

        (period === 'all' ? years : period === 'year' ? months : days).forEach(item => {
            const count = this.ordersToPeriod.filter(order => {
                const date = new Date(order.dateCreate)
                return (period === 'all' && date.getFullYear() === item || period === 'year' && date.getMonth() === item || period === 'month' && date.getDate() === item) && order.status !== '7'
            }).length
            data.push({x: period === 'year' ? lang.months[item] : item, y: count})
        })

        return [{id: lang.statisticsGraphics.count, data}]
    }

    getIncome = period => {
        const data = {
            [lang.statisticsGraphics.entity]: [],
            [lang.statisticsGraphics.individual]: []
        }
        const months = Array.from(Array(12).keys())
        const days = Array.from(Array(new Date(this.ordersToPeriod[this.ordersToPeriod.length - 1].dateCreate).getDate()+1).keys()).slice(1)
        const years = period === 'all' ? [...new Set(this.ordersToPeriod.map(({dateCreate}) => new Date(dateCreate).getFullYear()))].sort() : [];

        (period === 'all' ? years : period === 'year' ? months : days).forEach(item => {
            const sum = this.ordersToPeriod.filter(order => {
                const date = new Date(order.dateCreate)
                return (period === 'all' && date.getFullYear() === item || period === 'year' && date.getMonth() === item || period === 'month' && date.getDate() === item) && parseInt(order.status) >= 3 && order.status !== '7'
                }).reduce((res, order)=> {
                    const client = order.orderForEntity ? lang.statisticsGraphics.entity : lang.statisticsGraphics.individual
                    res[client] += order.amount
                    return res
                }, {[lang.statisticsGraphics.entity]: 0, [lang.statisticsGraphics.individual]: 0})
            data[lang.statisticsGraphics.entity].push({x: period === 'year' ? lang.months[item] : item, y: sum[lang.statisticsGraphics.entity]})
            data[lang.statisticsGraphics.individual].push({x: period === 'year' ? lang.months[item] : item, y: sum[lang.statisticsGraphics.individual]})
        })

        return [
            {id: lang.statisticsGraphics.entity, data: data[lang.statisticsGraphics.entity]},
            {id: lang.statisticsGraphics.individual, data: data[lang.statisticsGraphics.individual]},
        ]
    }

}

export default new StatisticsService()