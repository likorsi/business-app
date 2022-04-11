import {action, makeAutoObservable, observable} from "mobx";
import TasksService from "../service/TasksService";
import {Task} from "../domain/Task";
import {lang} from "../lang";

class TasksStore {

    constructor() {
        makeAutoObservable(this)
    }

    @observable isModifyTask = false
    @observable isDeleteWindowOpen = false

    @observable isShowToast = false
    @observable toastText = ''
    @observable toastStatus = false
    @observable loading = false
    @observable error = false

    @observable tasks = []
    @observable newTask = new Task()

    @action onCloseWindow = () => {
        this.isDeleteWindowOpen = false
        this.isModifyTask = false
        this.newTask.clear()
    }

    updateTasks = () => {
        this.tasks = TasksService.getTasks()
    }

    @action onModifyTask = async () => {
        await TasksService.createOrUpdateTask(this.newTask)
        this.error = TasksService.getError()
        this.toastText = this.error ? lang.errorCreateTask : lang.successCreateTask
        if (this.error) {
            this.isShowToast = true
        } else {
            !this.newTask.id && (this.isShowToast = true)
            await this.updateTasks()
            this.onCloseWindow()
        }
    }

    @action onDeleteTask = async () => {
        await TasksService.deleteTask(this.newTask.id)
        this.error = TasksService.getError()
        this.toastText = this.error ? lang.errorDeleteTask : lang.successDeleteTask
        this.isShowToast = true
        if (!this.error) {
            await this.updateTasks()
            this.onCloseWindow()
        }
    }


    onInit = async () => {
        this.isShowToast = false
        this.loading = true
        await TasksService.loadTasks()
        this.tasks = TasksService.getTasks()
        this.loading = false
    }

}

export default new TasksStore()