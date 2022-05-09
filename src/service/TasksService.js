import {getAuth, onAuthStateChanged} from "firebase/auth";
import {child, get, getDatabase, onValue, push, ref as refDB, remove, update} from "firebase/database";
import {getStorage} from "firebase/storage";
import {Task} from "../domain/Task";

class TasksService {
    constructor() {
        this.tasks = []
        this.error = null
        this.auth = getAuth()
        this.db = getDatabase()
        this.storage = getStorage()
        this.startUrl = localStorage.getItem('userId')

        onAuthStateChanged(getAuth(), async (user) => {
            if (user) {
                this.startUrl = localStorage.getItem('userId')
            } else {
                this.tasks = []
            }
        });

        onValue(refDB(this.db, `${this.startUrl}/tasks`), snapshot => {
            if (snapshot.exists()) {
                snapshot.val() && this.updateTasks(snapshot.val())
            } else {
                this.tasks = []
                console.log("No data available (tasks)");
            }
        });
    }

    getError = () => this.error

    getTasks = () => this.tasks

    createOrUpdateTask = async (task) => {
        try {
            this.error = null

            const key = task.id || push(child(refDB(this.db), `${this.startUrl}/tasks`)).key;

            await update(refDB(this.db, `${this.startUrl}/tasks/${key}`), {
                task: task.task,
                done: task.done,
            });

        } catch (e) {
            this.error = e
        }
    }

    deleteTask = async (id) => {
        try {
            this.error = null

            await remove(refDB(this.db, `${this.startUrl}/tasks/${id}`));

        } catch (e) {
            this.error = e
        }
    }

    updateTasks = data => {
        this.tasks = Object.keys(data)
            .map((key) => {
                const task = new Task()
                task.init({
                    id: key,
                    ...data[key],
                })
                return task
            })
            .reverse()
            .sort((a, b) => a.done - b.done)
    }

    loadTasks = async () => {
        try {
            this.error = null
            const snapshot = await get(child(refDB(this.db), `${this.startUrl}/tasks`))
            snapshot.val() && this.updateTasks(snapshot.val())
        } catch (e) { this.error = e }
    }

}

export default new TasksService()