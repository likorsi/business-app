import React, {useEffect} from "react";
import {useLocation, useParams} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Loader} from "../../components/Loader/Loader";
import {Button, Card, Col, DropdownButton, Form, Row, Stack} from "react-bootstrap";
import CardItem from "../../components/CardItem";
import {runInAction} from "mobx";
import {lang} from "../../lang";
import ShowProduct from "../Products/ShowProduct";
import Multiselect from "../../components/Multiselect";
import Cart from "../../../public/icons/cart.svg";
import ShowCart from "./ShowCart.jsx";

const PublicPage = inject('PublicStore')(observer(({PublicStore}) => {

    const {user} = useParams()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname === `/users/${user}`) {
            PublicStore.setStartUrl(user)
            PublicStore.onInit()
        }
    }, [location.pathname])

    return PublicStore.loading
        ? <div className='centered'><Loader/></div>
        : <>
            <Card body style={{marginBottom: 15, textAlign: 'center'}} border='light'>
                {PublicStore.publicInfo?.photo.src &&
                    <Card.Img className='circle-image' style={{marginBottom: 10}} variant='top' src={PublicStore.publicInfo?.photo.src}/>
                }
                <p> {PublicStore.publicInfo.username} </p>
                { PublicStore.publicInfo.helpText && <p> {PublicStore.publicInfo.helpText.split('\n').map((row, index) => <span key={index}>{row}<br/></span>)} </p>}
            </Card>
            <Stack direction="horizontal" gap={4} style={{flexWrap: 'wrap'}}>
                <Form.Select
                    style={{maxWidth: 180, cursor: 'pointer'}}
                    onChange={e => runInAction(() => {
                        PublicStore.filters.sorting = e.target.value
                        PublicStore.filterProducts()
                    })}
                >
                    <option value={null}>{lang.sorting.default}</option>
                    <option value="az">{lang.sorting.AZ}</option>
                    <option value="za">{lang.sorting.ZA}</option>
                </Form.Select>
                <DropdownButton variant="light" title={lang.categories}>
                    <Multiselect
                        style={{padding: 10}}
                        items={PublicStore.categories}
                        untitledItem={lang.noCategory}
                        onChange={checked => runInAction(() => {
                            PublicStore.filters.checkedCategories = checked
                            PublicStore.filterProducts()
                        })}
                        checked={PublicStore.filters.checkedCategories}
                    />
                </DropdownButton>
                <Button
                    onClick={() => runInAction(() => (PublicStore.isCartWindowOpen = true))}
                    className='ms-auto'
                    variant="outline-info"
                    style={{maxWidth: 200}}
                >
                    {lang.cart}
                </Button>
            </Stack>
            <Button
                onClick={() => runInAction(() => (PublicStore.isCartWindowOpen = true))}
                className='fixed-btn'
                variant="outline-info"
            >
                <Cart/>
            </Button>
            {
                PublicStore.products.length > 0
                    ? <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4" style={{marginTop: 10}}>
                        {PublicStore.products.map(product => (
                            <Col key={product.id}>
                                <CardItem
                                    img={product.images}
                                    title={product.name}
                                    price={product.price}
                                    badge={product.badge}
                                    onCardClick={() => runInAction(() => {
                                        PublicStore.selectedProduct.init(product)
                                        PublicStore.isShowProductWindowOpen = true
                                    })}
                                    productCountInCart={PublicStore.getProductCountInCart(product.id)}
                                    onAddToCart={() => runInAction(() => {
                                        PublicStore.addToCart(product)
                                    })}
                                    onRemoveFromCart={() => runInAction(() => {
                                        PublicStore.removeFromCart(product)
                                    })}
                                >{product.description?.split('\n').map((row, index) => <span key={index}>{row}<br/></span>) || ''}</CardItem>
                            </Col>
                        ))}
                    </Row>
                    : <div className='centered'>{PublicStore.filtersUsed ? lang.noProductsForOrder : lang.noProductsWithThisFilters}</div>
            }

            { PublicStore.selectedProduct.id &&
                <ShowProduct
                    show={PublicStore.isShowProductWindowOpen}
                    categories={PublicStore.categories}
                    selected={PublicStore.selectedProduct}
                    onCloseWindow={() => PublicStore.onCloseWindow()}
                    onAddToCart={() => PublicStore.addToCart()}
                />
            }

            <ShowCart/>
        </>
}))

export default PublicPage