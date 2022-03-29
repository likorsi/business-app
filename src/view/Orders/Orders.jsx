import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {useLocation} from "react-router-dom";
import {Button, Row, Stack} from "react-bootstrap";
import {runInAction} from "mobx";
import {lang} from "../../lang";
import {Loader} from "../../components/Loader/Loader";
import ToastNotify from "../../components/ToastNotify";
import ModalWindow from "../../components/ModalWindow";
import CreateOrder from "./CreateOrder";
import ShowOrder from "./ShowOrder";
import OrdersToolbar from "./OrdersToolbar";

const Orders = inject('OrdersStore')(observer(({OrdersStore}) => {

    const location = useLocation()

    useEffect(() => {
        location.pathname === '/orders' && OrdersStore.onInit()
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
                        ? <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4" style={{marginTop: 10}}>
                            {OrdersStore.orders.map(order => (
                                <div key={order.id}>{order.id}</div>
                            ))}
                        </Row>
                        : <div className='centered'>{OrdersStore.filtersUsed ? lang.noOrders : lang.noOrdersWithThisFilters}</div>
            }

            <ToastNotify
                show={OrdersStore.isShowToast}
                onClose={() => (runInAction(() => OrdersStore.isShowToast = false))}
                text={OrdersStore.toastText}
                isSuccess={!OrdersStore.error}
            />

            <ModalWindow
                title={lang.deleteProduct}
                submitText={lang.deletePromptText}
                submitType='outline-danger'
                show={OrdersStore.isDeleteWindowOpen}
                onClose={() => OrdersStore.onCloseWindow()}
                onSubmit={() => OrdersStore.onDeleteOrder()}
            >
                {`Вы действительно хотите удалить заказ №"${OrdersStore.newOrder.orderNumber}"?`}
            </ModalWindow>

            <CreateOrder/>
            <ShowOrder/>

        </>
    )
}))

export default Orders