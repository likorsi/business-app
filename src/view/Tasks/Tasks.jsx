import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {useLocation} from "react-router-dom";
import {Button, Form, InputGroup, Stack, Table} from "react-bootstrap";
import {runInAction} from "mobx";
import {lang} from "../../lang";
import {Loader} from "../../components/Loader/Loader";
import Delete from "../../../public/icons/delete.svg";
import Edit from "../../../public/icons/edit.svg";
import ToastNotify from "../../components/ToastNotify";
import ModalWindow from "../../components/ModalWindow";

const Tasks = inject('TasksStore')(observer(({TasksStore}) => {

    const location = useLocation()

    useEffect(() => {
        location.pathname === '/tasks' && TasksStore.onInit()
    }, [location.pathname])

    return (
        <>
            <Stack direction="horizontal" gap={2} style={{flexWrap: 'wrap', marginBottom: 5}}>
                <InputGroup className="mb-3">
                    <Button
                        style={{width: 50}}
                        variant="outline-success"
                        disabled={!TasksStore.newTask.checkRequiredFields()}
                        onClick={() => runInAction(async () => await TasksStore.onModifyTask())}>
                        {TasksStore.isModifyTask ? <span>&#128504;</span> : '+'}
                    </Button>
                    <Form.Control
                        placeholder={lang.addTask}
                        type='text'
                        value={(!TasksStore.newTask.id || TasksStore.isModifyTask) ? TasksStore.newTask.task : ''}
                        onChange={event => runInAction(() => {TasksStore.newTask.task = event.target.value})}
                    />
                    { TasksStore.isModifyTask &&
                        <Button
                            style={{width: 50}}
                            variant="outline-danger"
                            onClick={() => runInAction( () => {
                                TasksStore.isModifyTask = false
                                TasksStore.newTask.clear()
                            })}>
                            <span>&#215;</span>
                        </Button>
                    }
                </InputGroup>
            </Stack>

            { TasksStore.loading
                ? <div className='centered'><Loader/></div>
                : TasksStore.tasks.length > 0
                    ? <Table responsive borderless style={{marginTop: 15}}>
                        <tbody>
                        { TasksStore.tasks.map((task, index) => (
                            <tr
                                key={index}
                                onClick={() => runInAction(async () => {
                                    TasksStore.newTask.init(task)
                                    TasksStore.newTask.check()
                                    await TasksStore.onModifyTask()
                                })}
                            >
                                <td style={{cursor: "pointer"}}>
                                    {task.done
                                        ? <span style={{opacity: 0.7, textDecoration: 'line-through'}}>{task.task}</span>
                                        : task.task
                                    }
                                </td>
                                <td style={{width: '5%', marginLeft: 5}}>
                                    <Button
                                        className='my-btn'
                                        onClick={(e) => runInAction(() => {
                                            e.stopPropagation()
                                            TasksStore.newTask.init(task)
                                            TasksStore.isDeleteWindowOpen = true
                                        })}
                                        variant="light"
                                        size='sm'
                                    ><Delete/></Button>

                                </td>
                                <td style={{width: '5%'}}>
                                    <Button
                                        className='my-btn'
                                        onClick={(e) => runInAction(async () => {
                                            e.stopPropagation()
                                            TasksStore.newTask.init(task)
                                            TasksStore.isModifyTask = true
                                        })}
                                        variant="light"
                                        size='sm'
                                    ><Edit/></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    : <div className='centered'>{lang.noTasks}</div>
            }

            <ToastNotify
                show={TasksStore.isShowToast || false}
                onClose={() => runInAction(() => TasksStore.isShowToast = false)}
                text={TasksStore.toastText}
                isSuccess={!TasksStore.error}
            />

            <ModalWindow
                title={lang.deleteTask}
                submitText={lang.deletePromptText}
                submitType='outline-danger'
                show={TasksStore.isDeleteWindowOpen}
                onClose={() => TasksStore.onCloseWindow()}
                onSubmit={() => runInAction(async () => await TasksStore.onDeleteTask())}
            >
                {`Вы действительно хотите удалить выбранную задачу ?`}
            </ModalWindow>

        </>
    )
}))

export default Tasks