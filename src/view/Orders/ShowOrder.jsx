import React from "react";
import {inject, observer} from "mobx-react";
import {Badge, Card} from "react-bootstrap";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";

const ShowOrder = inject('OrdersStore')(observer(({OrdersStore}) => (
        <ModalWindow
            title={`Заказ №${OrdersStore.newOrder.orderNumber}`}
            subtitle={lang.orderStatus[OrdersStore.newOrder.status]}
            hideFooter={true}
            show={OrdersStore.isShowWindowOpen}
            onClose={() => OrdersStore.onCloseWindow()}
        >
            {
                OrdersStore.newOrder.receiptUrl &&
                <>
                    <Card.Subtitle>{lang.order.receipt}</Card.Subtitle>
                    <a className='mt-1 wrap' href={OrdersStore.newOrder.receiptUrl} target='_blank'>{OrdersStore.newOrder.receiptUrl}</a>
                    <div className='mb-4'/>
                </>
            }

            <Card.Subtitle>{lang.order.client}</Card.Subtitle>
            <p className='mb-1 mt-1'>{OrdersStore.newOrder.client} {OrdersStore.newOrder.inn && `, ${OrdersStore.newOrder.inn}`}</p>
            <p className='mb-4 mt-1'>
                <a href={`tel:${OrdersStore.newOrder.replacePhone}`}>
                    {OrdersStore.newOrder.beautifulPhone}
                </a>
            </p>

            <Card.Subtitle>{lang.order.deliveryPlace}</Card.Subtitle>
            {
                !OrdersStore.newOrder.delivery
                    ? lang.order.pickup
                    : OrdersStore.newOrder.getAddress()
            }
            <div className='mb-4'/>
            <Card.Subtitle>{lang.order.products}</Card.Subtitle>
            {
                OrdersStore.getProductsList().map(product => (
                    <p className='m-1 ml-0'><Badge className='mr-2' bg='light' style={{color: 'black'}}>{product.count}</Badge> {product.name}</p>
                ))
            }
            <div className='mb-4'/>
            <Card.Subtitle>{lang.order.amount}</Card.Subtitle>
            <p className='mb-4 mt-1' style={{fontSize: '1.6em'}}>{OrdersStore.newOrder.amount} &#8381; </p>

            { OrdersStore.newOrder.description &&
                <>
                    <Card.Subtitle>{lang.order.description}</Card.Subtitle>
                    <p className='mb-4 mt-1'>{OrdersStore.newOrder.description}</p>
                </>
            }

        </ModalWindow>
)))

export default ShowOrder