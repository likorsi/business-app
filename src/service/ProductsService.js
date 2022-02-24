import axios from "axios";

class ProductsService {

    constructor() {
        this.categories = []
        this.error = null
    }

    getCategories = () => this.categories

    getError = () => this.error

    createCategory = async (item) => {
        try {
            this.error = null
            await axios.post('/categories.json', {name: item})
        } catch (e) {
            this.error = e
        }
    }

    deleteCategory = async (id) => {
        try {
            this.error = null
            await axios.delete('/categories.json', this.categories.find(item => item.id === id))
        } catch (e) {
            this.error = e
        }
    }

    loadCategories = async () => {
        try {
            this.error = null
            const response = await axios.get(`/categories.json`)

            // console.log(response.data['-MlaQhU8LuEO6dNAtIxd'].name)
            // response.data.map(item => {
            // 	categories.push(item.name)
            // })

            Object.keys(response.data).forEach((key, index) => {
                this.categories.push({
                    name: response.data[key].name,
                    id: key
                })
            })

        } catch (e) {
            this.error = e
        }
    }


}

export default new ProductsService()