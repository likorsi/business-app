import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {useLocation} from "react-router-dom";
import {Button, Stack, Table, Form, Badge} from "react-bootstrap";
import {runInAction} from "mobx";
import {Loader} from "../../components/Loader/Loader";
import ToastNotify from "../../components/ToastNotify";
import ModalWindow from "../../components/ModalWindow";
import CreateOrder from "./CreateOrder";
import ShowOrder from "./ShowOrder";
import OrdersToolbar from "./OrdersToolbar";
import IncomeActions from "./IncomeActions";
import Delete from "../../../public/icons/delete.svg";
import Edit from "../../../public/icons/edit.svg";
import {lang} from "../../lang";

const Orders = inject('OrdersStore')(observer(({OrdersStore}) => {

    const location = useLocation()

    useEffect(() => {
        location.pathname.startsWith('/orders') && OrdersStore.onInit()
    }, [location.pathname])

    return (
        <>
            <Stack direction="horizontal" gap={2} style={{flexWrap: 'wrap', marginBottom: 15}}>
                <Button variant="outline-secondary" onClick={() => runInAction(() => (OrdersStore.isModifyWindowOpen = true))}>{lang.addOrder}</Button>
            </Stack>
            <OrdersToolbar/>

            {
                OrdersStore.loading
                    ? <div className='centered'><Loader/></div>
                    : OrdersStore.orders.length > 0
                        ? <Table responsive borderless style={{marginTop: 15}}>
                            <tbody>
                            <tr>
                                <th>&#8470;</th>
                                <th>{lang.order.status}</th>
                                <th>{lang.order.amount}</th>
                                <th>{lang.order.client}</th>
                                <th>{lang.order.deliveryPlace}</th>
                                <th>{lang.order.date}</th>
                                <th/>
                                <th/>
                            </tr>
                            { OrdersStore.orders.map((order, index) => (
                                <tr
                                    key={index}
                                    style={{cursor: 'pointer', verticalAlign: 'middle'}}
                                    onClick={() => runInAction(() => {
                                        OrdersStore.newOrder.init(order)
                                        OrdersStore.isShowWindowOpen = true
                                    })}
                                >
                                    <td><Badge bg={lang.orderStatusColors[order.status]}>{order.orderNumber}</Badge></td>
                                    <td>
                                        <Form.Select
                                            style={{minWidth: 100, cursor: 'pointer'}}
                                            value={order.status}
                                            onClick={e => e.stopPropagation()}
                                            onChange={e => runInAction(() => (OrdersStore.onUpdateStatus(order.id, e.target.value)))}
                                        >
                                            {
                                                OrdersStore.statuses
                                                    .map(status => (
                                                        <option
                                                            key={status.id}
                                                            value={status.id}
                                                        >
                                                            {status.name}
                                                        </option>
                                                    ))
                                            }
                                        </Form.Select>
                                    </td>
                                    <td>{order.amount}</td>
                                    <td>{order.client} {order.inn && `, ${order.inn}`}</td>
                                    <td>{order.delivery ? `${order.address.country}, ${order.address.city}` : lang.order.pickup}</td>
                                    <td>{OrdersStore.beautifyDate(order.dateCreate)}</td>
                                    <td style={{width: '5%', marginLeft: 5}}>
                                        <Button
                                            className='my-btn'
                                            onClick={e => runInAction(() => {
                                                e.stopPropagation()
                                                OrdersStore.newOrder.init(order)
                                                OrdersStore.isDeleteWindowOpen = true
                                            })}
                                            variant="light"
                                            size='sm'
                                        ><Delete/></Button>
                                    </td>
                                    <td style={{width: '5%'}}>
                                        <Button
                                            className='my-btn'
                                            onClick={e => runInAction(async () => {
                                                e.stopPropagation()
                                                OrdersStore.newOrder.init(order)
                                                OrdersStore.isModifyWindowOpen = true
                                            })}
                                            variant="light"
                                            size='sm'
                                        ><Edit/></Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        : <div className='centered'>{OrdersStore.filtersUsed && OrdersStore.rawOrders.length > 0 ? lang.noOrdersWithThisFilters : lang.noOrders}</div>
            }

            <ToastNotify
                show={OrdersStore.isShowToast}
                onClose={() => (runInAction(() => OrdersStore.isShowToast = false))}
                text={OrdersStore.toastText}
                isSuccess={!OrdersStore.error}
            />

            <ModalWindow
                title={lang.deleteOrder}
                submitText={lang.deletePromptText}
                submitType='outline-danger'
                show={OrdersStore.isDeleteWindowOpen}
                onClose={() => OrdersStore.onCloseWindow()}
                onSubmit={() => OrdersStore.onDeleteOrder()}
            >
                {`Вы действительно хотите удалить заказ №${OrdersStore.newOrder.orderNumber}?`}
            </ModalWindow>

            <IncomeActions/>
            <CreateOrder/>
            <ShowOrder/>

        </>
    )
}))

export default Orders