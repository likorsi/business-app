import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {useLocation} from "react-router-dom";

const Orders = inject('OrdersStore')(observer(({OrdersStore}) => {

    let location = useLocation()

    useEffect(() => {
        location.pathname === '/orders' && OrdersStore.onInit()
    }, [location.pathname])

    return (
        <div>Orders</div>
    )
}))

export default Orders