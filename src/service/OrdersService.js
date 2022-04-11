import {getAuth} from "firebase/auth";
import {child, get, getDatabase, onValue, push, ref as refDB, remove, update} from "firebase/database";
import {getStorage} from "firebase/storage";
import NalogAPI from "moy-nalog";
import AuthService from "./AuthService";
import {Order} from "../domain/Order";

class OrdersService {
    constructor() {
        this.orders = []
        this.ordersCount = []
        this.error = null
        this.auth = getAuth()
        this.db = getDatabase()
        this.storage = getStorage()
        this.startUrl = localStorage.getItem('userId')
        this.nalogApi = new NalogAPI({autologin: false})

        onValue(refDB(this.db, `${this.startUrl}/orders`), snapshot => {
            if (snapshot.exists()) {
                snapshot.val() && this.updateOrders(snapshot.val())
            } else {
                this.orders = []
                this.ordersCount = 1
                console.log("No data available (orders)");
            }
        });
    }

    getError = () => this.error

    getOrders = () => this.orders

    createOrUpdateOrder = async (order) => {
        try {
            this.error = null

            console.log(order.replacePhone)

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
            console.log(await this.nalogApi.userInfo())

            const nalogInfo = AuthService.getNalogInfo()
            const payload = {
                paymentType: 'CASH',
                ignoreMaxTotalIncomeRestriction: false,
                client: { contactPhone: null, displayName: null, incomeType: 'FROM_INDIVIDUAL', inn: null },

                requestTime: this.nalogApi.dateToLocalISO(),
                operationTime: this.nalogApi.dateToLocalISO(new Date()),

                services: [{
                    name: `${nalogInfo.incomeName} #${order.orderNumber}`, // 'Предоставление информационных услуг #970/2495',
                    amount: Number(order.amount.toFixed(2)),
                    quantity: Number(1)
                }],

                totalAmount: (order.amount * 1).toFixed(2)
            }

            console.log(payload)

            // const response = await this.nalogApi.addIncome({
            //     name: `${nalogInfo.incomeName} #${order.orderNumber}`,
            //     amount: order.amount
            // })

            await update(refDB(getDatabase(), `${this.startUrl}/nalog`), {
                refreshToken: this.nalogApi.refreshToken,
            });

            // if (response.approvedReceiptUuid) {
            //     await update(refDB(this.db, `${this.startUrl}/orders/data/${id}`), {
            //         receiptId: response.approvedReceiptUuid,
            //         receiptUrl: response.printUrl
            //     })
            // } else {
            //     this.error = response.error
            // }

        } catch (e) { this.error = e }
    }

    rejectIncome = async (id, rejectReason) => {
        try {
            this.error = null
            const order = this.orders.find(order => order.id === id)

            this.initNalogApi()
            console.log(await this.nalogApi.userInfo())

            const payload = {
                comment: rejectReason,
                operationTime: this.nalogApi.dateToLocalISO(new Date()),
                partnerCode: null,
                receiptUuid: order.receiptId,
                requestTime: this.nalogApi.dateToLocalISO(new Date()),
            }

            console.log(payload)
            // const response = await this.nalogApi.call('cancel', payload)
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