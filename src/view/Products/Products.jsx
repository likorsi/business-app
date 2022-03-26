import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";
import {Button, Col, Row, Stack} from "react-bootstrap";
import CardItem from "../../components/CardItem";
import ModalWindow from "../../components/ModalWindow.jsx";
import {lang} from "../../lang";
import ProductsToolbar from "./ProductsToolbar";
import ToastNotify from "../../components/ToastNotify";
import CreateProduct from "./CreateProduct";
import CreateCategory from "./CreateCategory";
import ShowProduct from "./ShowProduct";
import {Loader} from "../../components/Loader/Loader";
import {runInAction} from "mobx";
import {useLocation} from "react-router-dom";

const Products = inject("ProductsStore")(observer(({ProductsStore}) => {


    let location = useLocation()

    useEffect(() => {
        location.pathname === '/products' && ProductsStore.onInit()
    }, [location.pathname])

    return (
        <>
            <Stack direction="horizontal" gap={2} style={{flexWrap: 'wrap', marginBottom: 15}}>
                <Button variant="outline-secondary" onClick={() => runInAction(() => (ProductsStore.isModifyCategoryWindowOpen = true))}>{lang.addCategoryButton}</Button>
                <Button variant="outline-secondary" onClick={() => runInAction(() => (ProductsStore.isModifyProductWindowOpen = true))}>{lang.addProductButton}</Button>
            </Stack>
            <ProductsToolbar/>

            {
                ProductsStore.loading
                    ? <div className='centered'><Loader/></div>
                    : ProductsStore.products.length > 0
                        ? <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4" style={{marginTop: 10}}>
                        {ProductsStore.products.map(product => (
                            <Col key={product.id}>
                                <CardItem
                                    img={product.images}
                                    title={product.name}
                                    price={product.price}
                                    badge={product.badge}
                                    onDelete={() => runInAction(() => {
                                        ProductsStore.selected = product
                                        ProductsStore.isDeleteWindowOpen = true
                                    })}
                                    onEdit={() => runInAction(() => {
                                        ProductsStore.selected = product
                                        ProductsStore.newProduct.init(product)
                                        ProductsStore.isModifyProductWindowOpen = true
                                    })}
                                    onCardClick={() => runInAction(() => {
                                        ProductsStore.selected = product
                                        ProductsStore.isShowProductWindowOpen = true
                                    })}
                                    onAddToCart={() => runInAction(() => {
                                        ProductsStore.selected = product
                                        ProductsStore.addToCart()
                                    })}
                                >{product.description || ''}</CardItem>
                            </Col>
                        ))}
                    </Row>
                    : <div className='centered'>{lang.noProducts}</div>
            }

            <ToastNotify
                show={ProductsStore.isShowToast}
                onClose={() => (runInAction(() => ProductsStore.isShowToast = false))}
                text={ProductsStore.toastText}
                isSuccess={!ProductsStore.error}
            />

            <ModalWindow
                title={ProductsStore.isSelectedProduct ? lang.deleteProduct : lang.deleteCategory}
                submitText={lang.deletePromptText}
                submitType='outline-danger'
                show={ProductsStore.isDeleteWindowOpen}
                onClose={() => ProductsStore.onCloseWindow()}
                onSubmit={() => ProductsStore.isSelectedProduct ? ProductsStore.onDeleteProduct() : ProductsStore.onDeleteCategory()}
            >
                {`Вы действительно хотите удалить ${ProductsStore.isSelectedProduct ? 'продукт' : 'категорию'} "${ProductsStore.selected?.name}"?`}
            </ModalWindow>

            <CreateProduct/>

            {
                ProductsStore.isSelectedProduct
                    ? <>
                        <ShowProduct/>
                    </>
                    : <CreateCategory/>
            }
        </>
    )
}))

export default Products