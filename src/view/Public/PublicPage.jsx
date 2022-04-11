import React, {useEffect} from "react";
import {useLocation, useParams} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import {Button, Card, Col, DropdownButton, Form, Row, Stack} from "react-bootstrap";
import {Loader} from "../../components/Loader/Loader";
import CardItem from "../../components/CardItem";
import ToastNotify from "../../components/ToastNotify";
import ShowProduct from "../../components/ShowProduct";
import Multiselect from "../../components/Multiselect";
import ShowCart from "./ShowCart";
import Cart from "../../../public/icons/cart.svg";
import {lang} from "../../lang";
import Select from "../../components/Select";

const PublicPage = inject('PublicStore')(observer(({PublicStore}) => {

    const {user} = useParams()
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.startsWith(`/users/${user}`)) {
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
                <Select
                    items={PublicStore.sorting}
                    currentItem={PublicStore.filters.sorting}
                    onChange={current => runInAction(() => {
                        PublicStore.filters.sorting = current
                        PublicStore.filterProducts()
                    })}
                />
                <DropdownButton variant="light" title={lang.categories}>
                    <Multiselect
                        style={{padding: 10, maxHeight: 200}}
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
                                    notAvailable={product.notAvailable}
                                    price={product.price}
                                    badge={product.badge}
                                    onCardClick={() => runInAction(() => {
                                        PublicStore.selectedProduct.init(product)
                                        PublicStore.isShowProductWindowOpen = true
                                    })}
                                    productCountInCart={PublicStore.getProductCountInCart(product.id)}
                                    onAddToCart={() => runInAction(() => {
                                        PublicStore.addToCart(product.id)
                                    })}
                                    onRemoveFromCart={() => runInAction(() => {
                                        PublicStore.removeFromCart(product.id)
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
                    onAddToCart={() => PublicStore.addToCart(PublicStore.selectedProduct.id)}
                />
            }

            <ToastNotify
                show={PublicStore.isShowToast}
                onClose={() => (runInAction(() => PublicStore.isShowToast = false))}
                text={PublicStore.toastText}
                isSuccess={!PublicStore.error}
            />

            <ShowCart/>
        </>
}))

export default PublicPage