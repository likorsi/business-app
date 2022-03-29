import {getAuth} from "firebase/auth";
import {child, get, getDatabase, onValue, push, ref as refDB, remove, update} from "firebase/database";
import {getStorage} from "firebase/storage";
import {Contact} from "../domain/Contact";

class ContactsService {
    constructor() {
        this.contacts = []
        this.error = null
        this.auth = getAuth()
        this.db = getDatabase()
        this.storage = getStorage()
        this.startUrl = localStorage.getItem('userId')

        onValue(refDB(this.db, `${this.startUrl}/contacts`), snapshot => {
            if (snapshot.exists()) {
                snapshot.val() && this.updateContacts(snapshot.val())
            } else {
                this.contacts = []
                console.log("No data available (contacts)");
            }
        });
    }

    getError = () => this.error

    getContacts = () => this.contacts

    createOrUpdateContact = async (contact) => {
        try {
            this.error = null

            const key = contact.id || push(child(refDB(this.db), `${this.startUrl}/contacts`)).key;

            await update(refDB(this.db, `${this.startUrl}/contacts/${key}`), {
                name: contact.name,
                phone: contact.phone,
                description: contact.description || ''
            });

        } catch (e) {
            this.error = e
            console.log(e)
        }
    }

    deleteContact = async (id) => {
        try {
            this.error = null

            await remove(refDB(this.db, `${this.startUrl}/contacts/${id}`));

        } catch (e) {
            this.error = e
        }
    }

    updateContacts = data => {
        this.contacts = Object.keys(data)
            .map((key) => {
                const contact = new Contact()
                contact.init({
                    id: key,
                    ...data[key],
                })
                return contact
            })
            .sort((a, b) => a.name > b.name ? 1 : (a.name < b.name ? -1 : 0))
    }

    loadContacts = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/contacts`))
            snapshot.val() && this.updateContacts(snapshot.val())
        } catch (e) { this.error = e }
    }

}

export default new ContactsService()