import {getDownloadURL, getStorage, list, ref, uploadBytes, deleteObject} from "firebase/storage";
import {getDatabase, child, get, push, remove, ref as refDB, onValue, update} from "firebase/database";
import {getAuth} from "firebase/auth";
import {Product} from "../domain/Product";
import {Category} from "../domain/Category";

class ProductsService {

    constructor() {

        this.categories = []
        this.products = []
        this.error = null
        this.auth = getAuth()
        this.db = getDatabase()
        this.storage = getStorage()
        this.startUrl = localStorage.getItem('userId')

        onValue(refDB(this.db, `${this.startUrl}/categories`), snapshot => {
            if (snapshot.exists()) {
                snapshot.val() && this.updateCategories(snapshot.val())
            } else {
                this.categories =[]
                console.log("No data available (categories)");
            }
        });

        onValue(refDB(this.db, `${this.startUrl}/products`), async snapshot => {
            if (snapshot.exists()) {
                snapshot.val() && (await this.updateProducts(snapshot.val()))
            } else {
                this.products = []
                console.log("No data available (products)");
            }
        });
    }

    sleep = time => new Promise(r => setTimeout(r, time))

    getError = () => this.error

    getCategories = () => this.categories

    createCategory = async (category) => {
        try {
            this.error = null

            const key = category.id || push(child(refDB(this.db), `${this.startUrl}/categories`)).key;

            await update(refDB(this.db, `${this.startUrl}/categories/${key}`), {
                name: category.name
            });

        } catch (e) {
            this.error = e
        }
    }

    deleteCategory = async (id) => {
        try {
            this.error = null

            await remove(refDB(this.db, `${this.startUrl}/categories/${id}`));

        } catch (e) {
            this.error = e
        }
    }

    updateCategories = data => {
        this.categories = Object.keys(data).map((key) => {
            const category = new Category()
            category.init({
                id: key,
                name: data[key].name
            })
            return category
        })
    }

    loadCategories = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/categories`))
            snapshot.val() && this.updateCategories(snapshot.val())
        } catch (e) { this.error = e }
    }

    getProducts = () => this.products

    updateProducts = async data => {
        this.products = await Promise.all(Object.keys(data).map(async key => {
            const listImages = await list(ref(this.storage, `${this.startUrl}/${key}`))

            let images = listImages.items.map(async item => {
                const src = await getDownloadURL(ref(this.storage, item.fullPath))
                return {src, name: item.name, path: item.fullPath}
            })

            images = await Promise.all(images)

            const product = new Product()
            product.init({
                id: key,
                ...data[key],
                category: this.categories.find(({id}) => id === data[key].category)?.id || '0',
                images
            })
            return product
        }))
        this.products = [...this.products.reverse()]
    }

    loadProducts = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/products`))
            snapshot.val() && (await this.updateProducts(snapshot.val()))
        } catch (e) {
            this.error = e
        }
    }

    createOrUpdateProduct = async (product) => {
        try {
            this.error = null

            const key = product.id || push(child(refDB(this.db), `${this.startUrl}/products`)).key;

            await update(refDB(this.db, `${this.startUrl}/products/${key}`), {
                name: product.name,
                category: product.category || '',
                price: product.price,
                badge: product.badge || '',
                description: product.description || '',
                options: product.options,
                edit: new Date().toISOString()
            });

            if (product.isImagesModified) {
                product.imagesOld?.map(async file => {
                    await deleteObject(ref(this.storage, file.path))
                })

                product.images?.map(async file => {
                    const storageRef = ref(this.storage, `${localStorage.getItem('userId')}/${key}/${file.name}`);
                    await uploadBytes(storageRef, file)
                })
            }

            await this.loadProducts()

        } catch (e) {
            console.log(e)
            this.error = e
        }
    }

    deleteProduct = async (id, images) => {
        try {
            this.error = null
            await remove(refDB(this.db, `${this.startUrl}/products/${id}`));

            images?.map(async file => {
                await deleteObject(ref(this.storage, file.path))
            })
        } catch (e) {
            this.error = e
        }
    }

}

export default new ProductsService()