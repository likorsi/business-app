import React from "react";
import {inject, observer} from "mobx-react";
import {Button, ButtonGroup, Card, Form, Stack} from "react-bootstrap";
import {runInAction} from "mobx";
import ModalWindow from "../../components/ModalWindow.jsx";
import {lang} from "../../lang.js";

const ShowCart = inject('PublicStore')(observer(({PublicStore}) => (
            <ModalWindow
                title={lang.cart}
                show={PublicStore.isCartWindowOpen}
                submitText={lang.makeOrder}
                submitType='outline-success'
                disableSave={!PublicStore.order.checkRequiredFields()}
                onSubmit={() => PublicStore.createOrder()}
                onClose={() => PublicStore.onCloseWindow()}
            >
                <Card.Subtitle>{lang.clientOrder.order}</Card.Subtitle>
                <div className='mb-2'/>

                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.order.products}</Form.Label>
                    {
                        PublicStore.getProductsList().length > 0 &&
                        <><br/><Button
                            onClick={() => PublicStore.clearCart()}
                            variant="outline-danger"
                            size='sm'
                            style={{marginBottom: 5}}
                        >
                            {lang.clearCart}
                        </Button></>
                    }

                    {
                        PublicStore.getProductsList().map(product => (
                            <ButtonGroup style={{width: '100%', marginBottom: 5}} key={product.id}>
                                { PublicStore.getProductCountInCart(product.id) > 0 &&
                                    <Button
                                        onClick={() => PublicStore.addToCart(product.id)}
                                        variant="outline-success"
                                        size='sm'
                                        style={{width: '10%', marginRight: 10}}
                                    >
                                        {product.count}
                                    </Button>
                                }
                                <Button
                                    onClick={() => PublicStore.addToCart(product.id)}
                                    variant="outline-light"
                                    size='sm'
                                    style={{width: '100%', color: 'black'}}
                                >
                                    {product.name}
                                </Button>
                                { PublicStore.getProductCountInCart(product.id) > 0 &&
                                    <Button
                                        onClick={() => PublicStore.removeFromCart(product.id)}
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
                        PublicStore.getProductsList().length === 0
                            ? <p>{lang.noProductsInOrder}</p>
                            : <p className='wrap ms-auto' style={{fontSize: '1.2em'}}>{lang.clientOrder.amount}: {PublicStore.order.amount} &#8381; </p>
                    }
                </Form.Group>

                <div className='mt-4'/>
                <Card.Subtitle>{lang.clientOrder.info}</Card.Subtitle>

                <Form.Group className="mb-3 mt-2">
                    <Form.Label><div className='required'/>{lang.order.clientPhone}</Form.Label>
                    {!PublicStore.order.checkPhone() &&
                        <p className='hint-warning'>{lang.errorPhone}</p>
                    }
                    <Form.Control
                        type="text"
                        value={PublicStore.order.clientPhone}
                        onChange={event => runInAction(() => (PublicStore.order.clientPhone = event.target.value))}
                    />
                </Form.Group>

                <Form.Check
                    style={{marginBottom: 15}}
                    defaultChecked={PublicStore.order.orderForEntity}
                    label={lang.order.orderForEntity}
                    onClick={() => runInAction(() => (PublicStore.order.orderForEntity = !PublicStore.order.orderForEntity))}
                />

                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.order.client}</Form.Label>
                    <Form.Control
                        placeholder={PublicStore.order.orderForEntity ? lang.order.entityPlaceholder : ''}
                        type="text"
                        value={PublicStore.order.client}
                        onChange={event => runInAction(() => (PublicStore.order.client = event.target.value))}
                    />
                </Form.Group>

                {
                    PublicStore.order.orderForEntity &&
                    <Form.Group className="mb-3">
                        <Form.Label><div className='required'/>{lang.order.inn}</Form.Label>
                        {!PublicStore.order.checkInn() &&
                            <p className='hint-warning'>{lang.errorInn}</p>
                        }
                        <Form.Control
                            type="text"
                            value={PublicStore.order.inn}
                            onChange={event => runInAction(() => (PublicStore.order.inn = event.target.value))}
                        />
                    </Form.Group>

                }

                <div className='mt-4'/>
                <Card.Subtitle>{lang.clientOrder.delivery}</Card.Subtitle>

                <Form.Check
                    className='mt-2'
                    style={{marginBottom: 15}}
                    defaultChecked={!PublicStore.order.delivery}
                    label={lang.order.pickup}
                    onClick={() => runInAction(() => (PublicStore.order.delivery = !PublicStore.order.delivery))}
                />
                {
                    PublicStore.order.delivery &&
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label><div className='required'/>{lang.order.country}</Form.Label>
                            <Form.Control
                                type="text"
                                value={PublicStore.order.address.country}
                                onChange={event => runInAction(() => PublicStore.order.address.country = event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><div className='required'/>{lang.order.city}</Form.Label>
                            <Form.Control
                                type="text"
                                value={PublicStore.order.address.city}
                                onChange={event => runInAction(() => (PublicStore.order.address.city = event.target.value))}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><div className='required'/>{lang.order.address}</Form.Label>
                            <Form.Control
                                type="text"
                                value={PublicStore.order.address.address}
                                onChange={event => runInAction(() => (PublicStore.order.address.address = event.target.value))}
                            />
                        </Form.Group>
                    </>
                }

                <div className='mt-4'/>
                <Card.Subtitle>{lang.clientOrder.additional}</Card.Subtitle>

                <Form.Group className="mb-3 mt-2">
                    <Form.Label>{lang.clientOrder.description}</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={PublicStore.order.description}
                        onChange={event => runInAction(() => (PublicStore.order.description = event.target.value))}
                    />
                </Form.Group>

                <Stack direction='horizontal' gap={2} style={{fontSize: '1.6em'}}>
                    <p className='wrap'>{lang.clientOrder.amount}:</p>
                    <p className='wrap ms-auto'>{PublicStore.order.amount} &#8381; </p>
                </Stack>

            </ModalWindow>
)))

export default ShowCart