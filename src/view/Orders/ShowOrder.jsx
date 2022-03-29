import React from "react";
import {inject, observer} from "mobx-react";
import ModalWindow from "../../components/ModalWindow";

const ShowOrder = inject('OrdersStore')(observer(({OrdersStore}) => {
    return (
        <ModalWindow
            title={`Заказ #${OrdersStore.newOrder.orderNumber}`}
            hideFooter={true}
            show={OrdersStore.isShowWindowOpen}
            fullscreen={true}
            onClose={() => OrdersStore.onCloseWindow()}
        >
            <div>kjnkjmpo pkjpo</div>

        </ModalWindow>
    )
}))

export default ShowOrder