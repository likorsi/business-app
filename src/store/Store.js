import AuthStore from "./AuthStore";
import ProductsStore from "./ProductsStore";
import ContactsStore from "./ContactsStore";
import OrdersStore from "./OrdersStore";
import TasksStore from "./TasksStore";

class Store {
    constructor() {
        this.AuthStore = AuthStore
        this.ProductsStore = ProductsStore
        this.ContactsStore = ContactsStore
        this.OrdersStore = OrdersStore
        this.TasksStore = TasksStore
    }
}

export default new Store()