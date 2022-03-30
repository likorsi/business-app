import {getAuth} from "firebase/auth";
import {child, get, getDatabase, onValue, push, ref as refDB, remove, update} from "firebase/database";
import {getStorage} from "firebase/storage";
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

            const key = order.id || push(child(refDB(this.db), `${this.startUrl}/orders/data`)).key;

            const values = {
                client: order.client,
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
                receiptUrl: order.receiptUrl
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
        console.log(this.ordersCount)
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
}

export default new OrdersService()