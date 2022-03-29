import React from "react";
import {inject, observer} from "mobx-react";
import ModalWindow from "../../components/ModalWindow.jsx";
import {lang} from "../../lang.js";

const ShowCart = inject('PublicStore')(observer(({PublicStore}) => {
    return (
            <ModalWindow
                title={lang.cart}
                show={PublicStore.isCartWindowOpen}
                submitText={lang.makeOrder}
                submitType='outline-success'
                onSubmit={() => PublicStore.createOrder()}
                onClose={() => PublicStore.onCloseWindow()}
            >


                {
                    Object.keys(PublicStore.order?.products)
                        .map(key => (
                            <p key={key}>{key}: {PublicStore.order.products[key]}</p>
                        ))
                }

            </ModalWindow>
        )
}))

export default ShowCart