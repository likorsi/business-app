import {getAuth} from "firebase/auth";
import {child, get, getDatabase, onValue, push, ref as refDB, remove, update} from "firebase/database";
import {getStorage} from "firebase/storage";
import {Order} from "../domain/Order";

class OrdersService {
    constructor() {
        this.orders = []
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
                console.log("No data available (orders)");
            }
        });
    }

    getError = () => this.error

    getOrders = () => this.orders

    createOrUpdateOrder = async (order) => {
        try {
            this.error = null

            const key = order.id || push(child(refDB(this.db), `${this.startUrl}/orders`)).key;

            await update(refDB(this.db, `${this.startUrl}/orders/${key}`), {
                name: order.name,
            });

        } catch (e) {
            this.error = e
        }
    }

    deleteOrder = async (id) => {
        try {
            this.error = null

            await remove(refDB(this.db, `${this.startUrl}/orders/${id}`));

        } catch (e) {
            this.error = e
        }
    }

    updateOrders = data => {
        this.orders = Object.keys(data).map((key) => {
            const order = new Order()
            order.init({
                id: key,
                ...data[key],
            })
            return order
        })
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