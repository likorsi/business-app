import {getAuth} from "firebase/auth";
import {child, get, getDatabase, push, ref as refDB, update} from "firebase/database";
import {Category} from "../domain/Category";
import {Product} from "../domain/Product";
import {Photo} from "../domain/Photo";

class PublicService {
    constructor() {
        this.categories = []
        this.products = []
        this.publicInfo = {
            username: '',
            helpText: ''
        }
        this.error = null
        this.auth = getAuth()
        this.db = getDatabase()
        this.startUrl = ''
    }

    setStartUrl = (startUrl) => (this.startUrl = startUrl)

    getError = () => this.error

    getPublicInfo = () => this.publicInfo

    loadPublicInfo = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/info`))
            if (snapshot.exists()) {
                const photo = new Photo()
                photo.init(snapshot.val().photo)
                this.publicInfo = {
                    username: snapshot.val().username,
                    helpText: snapshot.val().helpText,
                    photo: photo
                }
            }
        } catch (e) { this.error = e }
    }

    getCategories = () => this.categories

    loadCategories = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/categories`))
            snapshot.val() && this.updateCategories(snapshot.val())
        } catch (e) { this.error = e }
    }

    updateCategories = data => {
        this.categories = Object.keys(data)
            .map((key) => {
                const category = new Category()
                category.init({
                    id: key,
                    name: data[key].name
                })
                return category
            })
            .sort((a, b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0))

    }

    getProducts = () => this.products

    loadProducts = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/products`))
            snapshot.val() && this.updateProducts(snapshot.val())
        } catch (e) {
            this.error = e
        }
    }

    updateProducts = data => {
        this.products = Object.keys(data).map(key => {
            const product = new Product()
            product.init({
                id: key,
                ...data[key],
                category: this.categories.find(({id}) => id === data[key].category)?.id || '0',
                images: data[key].images?.map(img => {
                    const newImg = new Photo()
                    newImg.init(img)
                    return newImg
                })
            })
            return product
        })
        this.products = [...this.products.reverse()]
    }

    createOrder = async (order) => {
        try {
            this.error = null

            let ordersCount = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/orders/ordersCount`))
            if (snapshot.val()) {
                ordersCount = snapshot.val() + 1
            } else {
                ordersCount = 1
            }

            const key = push(child(refDB(this.db), `${this.startUrl}/orders/data`)).key;

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
                orderNumber: ordersCount,
                receiptUrl: order.receiptUrl,
                create: new Date()
            }

            await update(refDB(this.db, `${this.startUrl}/orders/data/${key}`), values)
            await update(refDB(this.db, `${this.startUrl}/orders`), {ordersCount: ordersCount})

        } catch (e) { this.error = e }
    }
}

export default new PublicService()