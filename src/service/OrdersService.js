import {getAuth, onAuthStateChanged} from "firebase/auth";
import {child, get, getDatabase, onValue, push, ref as refDB, remove, update} from "firebase/database";
import {getStorage} from "firebase/storage";
import NalogAPI from "moy-nalog";
import AuthService from "./AuthService";
import {Order} from "../domain/Order";

class OrdersService {
    constructor() {
        this.orders = []
        this.ordersCount = 1
        this.error = null
        this.auth = getAuth()
        this.db = getDatabase()
        this.storage = getStorage()
        this.startUrl = localStorage.getItem('userId')
        this.nalogApi = new NalogAPI({autologin: false})

        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                this.startUrl = localStorage.getItem('userId')
            } else {
                this.orders = []
                this.ordersCount = 1
            }
        });

        onValue(refDB(this.db, `${this.startUrl}/orders`), snapshot => {
            if (snapshot.exists()) {
                snapshot.val() && this.updateOrders(snapshot.val())
            } else {
                this.orders = []
                this.ordersCount = 1
            }
        });
    }

    getError = () => this.error

    getOrders = () => this.orders

    createOrUpdateOrder = async (order) => {
        try {
            this.error = null

            const key = order.id || push(child(refDB(this.db), `${this.startUrl}/orders/data`)).key;

            const values = {
                client: order.client,
                clientPhone: order.replacePhone,
                amount: order.amount,
                products: order.products,
                status: order.status,
                delivery: order.delivery,
                address: order.delivery ? order.address : order.clearAddress(),
                edit: new Date(),
                orderForEntity: order.orderForEntity,
                inn: order.inn,
                description: order.description,
                orderNumber: this.ordersCount,
                receiptUrl: order.receiptUrl,
                receiptId: order.receiptId
            }

            if (!order.id) {
                values['create'] = new Date()
            }

            await update(refDB(this.db, `${this.startUrl}/orders/data/${key}`), values)
            await update(refDB(this.db, `${this.startUrl}/orders`), {ordersCount: this.ordersCount})

        } catch (e) {
            this.error = e
        }
    }

    updateStatus = async (id, status) => {
        try {
            this.error = null
            await update(refDB(this.db, `${this.startUrl}/orders/data/${id}`), {
                status: status
            })
        } catch (e) {
            this.error = e
        }
    }

    deleteOrder = async (id) => {
        try {
            this.error = null
            await remove(refDB(this.db, `${this.startUrl}/orders/data/${id}`));
        } catch (e) {
            this.error = e
        }
    }

    updateOrders = data => {
        this.ordersCount = data['ordersCount'] + 1 || 1
        this.orders = Object.keys(data['data']).map((key) => {
            const order = new Order()
            order.init({
                id: key,
                ...data['data'][key],
            })
            return order
        }).reverse()
    }

    loadOrders = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/orders`))
            snapshot.val() && this.updateOrders(snapshot.val())
        } catch (e) { this.error = e }
    }

    addIncome = async (id) => {
        try {
            this.error = null
            const order = this.orders.find(order => order.id === id)
            this.initNalogApi()

            const nalogInfo = AuthService.getNalogInfo()

            const response = await this.nalogApi.addIncome({
                name: `${nalogInfo.incomeName} #${order.orderNumber}`,
                amount: order.amount
            })

            await update(refDB(getDatabase(), `${this.startUrl}/nalog`), {
                refreshToken: this.nalogApi.refreshToken,
            });

            if (response.approvedReceiptUuid) {
                await update(refDB(this.db, `${this.startUrl}/orders/data/${id}`), {
                    receiptId: response.approvedReceiptUuid,
                    receiptUrl: response.printUrl
                })
            } else {
                this.error = response.error
            }

        } catch (e) { this.error = e }
    }

    rejectIncome = async (id, rejectReason) => {
        try {
            this.error = null
            const order = this.orders.find(order => order.id === id)

            this.initNalogApi()

            const payload = {
                comment: rejectReason,
                operationTime: this.nalogApi.dateToLocalISO(new Date()),
                partnerCode: null,
                receiptUuid: order.receiptId,
                requestTime: this.nalogApi.dateToLocalISO(new Date()),
            }

            await this.nalogApi.call('cancel', payload)
            await update(refDB(getDatabase(), `${this.startUrl}/nalog`), {
                refreshToken: this.nalogApi.refreshToken,
            });
        } catch (e) { this.error = e }
    }

    initNalogApi = () => {
        const nalogInfo = AuthService.getNalogInfo()
        this.nalogApi.refreshToken = nalogInfo.refreshToken
        this.nalogApi.INN = nalogInfo.inn
        this.nalogApi.sourceDeviceId = nalogInfo.deviceId
        this.nalogApi.authPromise = true
    }
}

export default new OrdersService()