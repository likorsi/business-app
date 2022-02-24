
import AuthStore from "./AuthStore";
import ProductsStore from "./ProductsStore";
import ContactsStore from "./ContactsStore";

class Store {
    constructor() {
        this.AuthStore = AuthStore
        this.ProductsStore = ProductsStore
        this.ContactsStore = ContactsStore
    }
}

export default new Store()