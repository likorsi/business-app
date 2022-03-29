import AuthStore from "./AuthStore";
import ProductsStore from "./ProductsStore";
import ContactsStore from "./ContactsStore";
import OrdersStore from "./OrdersStore";
import TasksStore from "./TasksStore";
import PublicStore from "./PublicStore";

class Store {
    constructor() {
        this.AuthStore = AuthStore
        this.ProductsStore = ProductsStore
        this.ContactsStore = ContactsStore
        this.OrdersStore = OrdersStore
        this.TasksStore = TasksStore
        this.PublicStore = PublicStore
    }
}

export default new Store()