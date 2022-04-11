import React from "react";
import {inject, observer} from "mobx-react";
import {Button, ButtonGroup, Card, Form, InputGroup, Stack} from "react-bootstrap";
import {runInAction} from "mobx";
import ModalWindow from "../../components/ModalWindow";
import Search from "../../../public/icons/search.svg";
import {lang} from "../../lang";

const CreateOrder = inject('OrdersStore')(observer(({OrdersStore}) => (
        <ModalWindow
            title={OrdersStore.newOrder.id ? `Заказ №${OrdersStore.newOrder.orderNumber}` : lang.createOrder}
            submitText={lang.saveText}
            submitType='outline-info'
            disableSave={!OrdersStore.newOrder.checkRequiredFields()}
            show={OrdersStore.isModifyWindowOpen}
            onClose={() => OrdersStore.onCloseWindow()}
            onSubmit={() => OrdersStore.onModifyOrder()}
        >
            <Card.Subtitle>{lang.ownerOrder.order}</Card.Subtitle>
            <div className='mb-2'/>

            <InputGroup>
                <Button
                    style={{width: 50}}
                    variant="outline-success"
                    onClick={() => OrdersStore.searchProduct()}>
                    <Search/>
                </Button>
                <Form.Control
                    placeholder={lang.findProduct}
                    type='text'
                    value={OrdersStore.searchProductText}
                    onChange={event => runInAction(() => {
                        OrdersStore.searchProductText = event.target.value
                        OrdersStore.searchProduct()
                    })}
                />
            </InputGroup>

            <Card
                body
                className='overflow-auto'
                style={{height: 200, marginBottom: 10, marginTop: 10}}
            >
                { OrdersStore.rawProducts.length === 0
                    ? <div className='centered'>{lang.noProducts}</div>
                    : OrdersStore.products.length === 0 ? <div className='centered'>{lang.noProductsWithThisFilters}</div> : null
                }
                {
                    OrdersStore.products.map( product => (
                        <Button
                            disabled={product.notAvailable}
                            key={product.id}
                            onClick={() => OrdersStore.addToOrder(product.id)}
                            variant="outline-light"
                            size='sm'
                            style={{width: '100%', color: 'black', marginBottom: 5}}
                        >
                            {product.name}
                        </Button>
                    ))
                }
            </Card>

            <Form.Group className="mb-3">
                <Form.Label><div className='required'/>{lang.order.products}</Form.Label>

                {
                    OrdersStore.getProductsList().map(product => (
                        <ButtonGroup style={{width: '100%', marginBottom: 5}} key={product.id}>
                            { OrdersStore.getProductCountInOrder(product.id) > 0 &&
                                <Button
                                    onClick={() => OrdersStore.addToOrder(product.id)}
                                    variant="outline-success"
                                    size='sm'
                                    style={{width: '10%', marginRight: 10}}
                                >
                                    {product.count}
                                </Button>
                            }
                            <Button
                                onClick={() => OrdersStore.addToOrder(product.id)}
                                variant="outline-light"
                                size='sm'
                                style={{width: '100%', color: 'black'}}
                            >
                                {product.name}
                            </Button>
                            { OrdersStore.getProductCountInOrder(product.id) > 0 &&
                                <Button
                                    onClick={() => OrdersStore.removeFromOrder(product.id)}
                                    variant="outline-danger"
                                    size='sm'
                                    style={{width: '10%', marginLeft: 10}}
                                >
                                    -
                                </Button>
                            }
                        </ButtonGroup>
                    ))
                }

                {
                    OrdersStore.getProductsList().length === 0
                        ? <p>{lang.noProductsInOrder}</p>
                        : <p className='wrap' style={{fontSize: '1.2em'}}>{lang.order.amount}: {OrdersStore.newOrder.amount} &#8381; </p>
                }
            </Form.Group>

            <div className='mt-4'/>
            <Card.Subtitle>{lang.ownerOrder.info}</Card.Subtitle>

            <Form.Group className="mb-3 mt-2">
                <Form.Label><div className='required'/>{lang.order.clientPhone}</Form.Label>
                {!OrdersStore.newOrder.checkPhone() &&
                    <p className='hint-warning'>{lang.errorPhone}</p>
                }
                <Form.Control
                    type="text"
                    value={OrdersStore.newOrder.clientPhone}
                    onChange={event => runInAction(() => (OrdersStore.newOrder.clientPhone = event.target.value))}
                />
            </Form.Group>

            <Form.Check
                style={{marginBottom: 15}}
                defaultChecked={OrdersStore.newOrder.orderForEntity}
                label={lang.order.orderForEntity}
                onClick={() => runInAction(() => (OrdersStore.newOrder.orderForEntity = !OrdersStore.newOrder.orderForEntity))}
            />

            <Form.Group className="mb-3">
                <Form.Label><div className='required'/>{lang.order.client}</Form.Label>
                <Form.Control
                    placeholder={OrdersStore.newOrder.orderForEntity ? lang.order.entityPlaceholder : ''}
                    type="text"
                    value={OrdersStore.newOrder.client}
                    onChange={event => runInAction(() => (OrdersStore.newOrder.client = event.target.value))}
                />
            </Form.Group>

            {
                OrdersStore.newOrder.orderForEntity &&
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.order.inn}</Form.Label>
                    {!OrdersStore.newOrder.checkInn() &&
                        <p className='hint-warning'>{lang.errorInn}</p>
                    }
                    <Form.Control
                        type="text"
                        value={OrdersStore.newOrder.inn}
                        onChange={event => runInAction(() => (OrdersStore.newOrder.inn = event.target.value))}
                    />
                </Form.Group>

            }

            <div className='mt-4'/>
            <Card.Subtitle>{lang.ownerOrder.delivery}</Card.Subtitle>

            <Form.Check
                className='mt-2'
                style={{marginBottom: 15}}
                defaultChecked={!OrdersStore.newOrder.delivery}
                label={lang.order.pickup}
                onClick={() => runInAction(() => (OrdersStore.newOrder.delivery = !OrdersStore.newOrder.delivery))}
            />
            {
                OrdersStore.newOrder.delivery &&
                <>
                    <Form.Group className="mb-3">
                        <Form.Label><div className='required'/>{lang.order.country}</Form.Label>
                        <Form.Control
                            type="text"
                            value={OrdersStore.newOrder.address.country}
                            onChange={event => runInAction(() => OrdersStore.newOrder.address.country = event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><div className='required'/>{lang.order.city}</Form.Label>
                        <Form.Control
                            type="text"
                            value={OrdersStore.newOrder.address.city}
                            onChange={event => runInAction(() => (OrdersStore.newOrder.address.city = event.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><div className='required'/>{lang.order.address}</Form.Label>
                        <Form.Control
                            type="text"
                            value={OrdersStore.newOrder.address.address}
                            onChange={event => runInAction(() => (OrdersStore.newOrder.address.address = event.target.value))}
                        />
                    </Form.Group>
                </>
            }

            <div className='mt-4'/>
            <Card.Subtitle>{lang.ownerOrder.additional}</Card.Subtitle>

            <Form.Group className="mb-3 mt-2">
                <Form.Label>{lang.order.description}</Form.Label>
                <Form.Control
                as="textarea"
                value={OrdersStore.newOrder.description}
                onChange={event => runInAction(() => (OrdersStore.newOrder.description = event.target.value))}
                />
            </Form.Group>

            <Stack direction='horizontal' gap={2} style={{fontSize: '1.6em'}}>
                <p className='wrap'>{lang.clientOrder.amount}:</p>
                <p className='wrap ms-auto'>{OrdersStore.newOrder.amount} &#8381; </p>
            </Stack>

        </ModalWindow>
)))

export default CreateOrder