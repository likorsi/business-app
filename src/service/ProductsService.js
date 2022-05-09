import {getDownloadURL, getStorage, ref, uploadBytes, deleteObject} from "firebase/storage";
import {getDatabase, child, get, push, remove, ref as refDB, onValue, update} from "firebase/database";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {Product} from "../domain/Product";
import {Category} from "../domain/Category";
import {Photo} from "../domain/Photo";

class ProductsService {

    constructor() {

        this.categories = []
        this.products = []
        this.error = null
        this.startUrl = localStorage.getItem('userId')

        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                this.startUrl = localStorage.getItem('userId')
            } else {
                this.categories = []
                this.products = []
            }
        });

        onValue(refDB(getDatabase(), `${this.startUrl}/categories`), snapshot => {
            if (snapshot.exists()) {
                snapshot.val() && this.updateCategories(snapshot.val())
            } else {
                this.categories =[]
            }
        });

        onValue(refDB(getDatabase(), `${this.startUrl}/products`),  snapshot => {
            if (snapshot.exists()) {
                snapshot.val() && this.updateProducts(snapshot.val())
            } else {
                this.products = []
            }
        });
    }

    getError = () => this.error

    getCategories = () => this.categories

    createCategory = async (category) => {
        try {
            this.error = null

            const key = category.id || push(child(refDB(getDatabase()), `${this.startUrl}/categories`)).key;

            await update(refDB(getDatabase(), `${this.startUrl}/categories/${key}`), {
                name: category.name
            });

        } catch (e) {
            this.error = e
        }
    }

    deleteCategory = async (id) => {
        try {
            this.error = null

            await remove(refDB(getDatabase(), `${this.startUrl}/categories/${id}`));

        } catch (e) {
            this.error = e
        }
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

    loadCategories = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(getDatabase()), `${this.startUrl}/categories`))
            snapshot.val() && this.updateCategories(snapshot.val())
        } catch (e) { this.error = e }
    }

    getProducts = () => this.products

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

    loadProducts = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(getDatabase()), `${this.startUrl}/products`))
            snapshot.val() && this.updateProducts(snapshot.val())
        } catch (e) {
            this.error = e
        }
    }

    createOrUpdateProduct = async (product) => {
        try {
            this.error = null

            const key = product.id || push(child(refDB(getDatabase()), `${this.startUrl}/products`)).key;

            let imageList = []

            if (product.isImagesModified) {

                const promise = product.imagesOld?.map(async file => {
                    await deleteObject(ref(getStorage(), file.fullPath))
                })

                await Promise.all(promise)

                imageList = product.images?.map(async file => {
                    const storageRef = ref(getStorage(), `${localStorage.getItem('userId')}/${key}/${file.name}`);
                    await uploadBytes(storageRef, file)
                    const src = await getDownloadURL(ref(getStorage(), storageRef.fullPath))

                    return {src: src, fullPath: storageRef.fullPath, name: storageRef.name}
                })

                imageList = await Promise.all(imageList)
            } else {
                imageList = product.images.map(img => img.getPhotoToLoad())
            }

            await update(refDB(getDatabase(), `${this.startUrl}/products/${key}`), {
                name: product.name,
                category: product.category || '',
                price: product.price,
                badge: product.badge || '',
                notAvailable: product.notAvailable || false,
                description: product.description || '',
                options: product.options,
                edit: new Date().toISOString(),
                images: imageList
            });

        } catch (e) {
            this.error = e
        }
    }

    deleteProduct = async (id, images) => {
        try {
            this.error = null
            await remove(refDB(getDatabase(), `${this.startUrl}/products/${id}`));

            images?.map(async file => {
                await deleteObject(ref(getStorage(), file.fullPath))
            })
        } catch (e) {
            this.error = e
        }
    }

}

export default new ProductsService()