import React from "react";
import {inject, observer} from "mobx-react";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";
import {Form} from "react-bootstrap";
import {runInAction} from "mobx";

const CreateOrder = inject('OrdersStore')(observer(({OrdersStore}) => {
    return (
        <ModalWindow
            title={OrdersStore.newOrder.id ? OrdersStore.newOrder.name : lang.createOrder}
            submitText={lang.saveText}
            submitType='outline-info'
            disableSave={!OrdersStore.newOrder.checkRequiredFields()}
            show={OrdersStore.isModifyWindowOpen}
            onClose={() => OrdersStore.onCloseWindow()}
            onSubmit={() => OrdersStore.onModifyOrder()}
        >
            <Form.Group className="mb-3">
                <Form.Label><div className='required'/>{lang.order.name}</Form.Label>
                <Form.Control
                    type="text"
                    value={OrdersStore.newOrder.name}
                    onChange={event => runInAction(() => (OrdersStore.newOrder.name = event.target.value))}
                />
            </Form.Group>
        </ModalWindow>
    )
}))

export default CreateOrder