import React from "react";
import {inject, observer} from "mobx-react";
import {Col, Form, Row} from "react-bootstrap";
import {CardItem} from "../../components/Card";
import {PromptModal} from "../../components/PromptModal";
import {lang} from "../../lang";
import ProductsToolbar from "./ProductsToolbar";
import ToastNotify from "../../components/ToastNotify";

const Products = inject("ProductsStore")(observer(({ProductsStore}) => {

    return (
        <>
            <ProductsToolbar/>
            <Row xs={1} md={3} className="g-4">
                {ProductsStore.products.map(item => (
                    <Col key={item.id}>
                        <CardItem
                            title={item.name}
                            warning={lang.limitWarningBadge}
                            onDelete={() => ProductsStore.handleDeleteWindow(item)}
                            onEdit={() => ProductsStore.handleEditWindow(item)}
                        >{item.description || ''}</CardItem>
                    </Col>
                ))}
            </Row>

            <ToastNotify
                show={ProductsStore.isShowToast}
                onClose={() => (ProductsStore.isShowToast = false)}
                text={ProductsStore.toastText}
                isSuccess={ProductsStore.toastStatus}
            />

            <PromptModal
                title={lang.deleteProduct}
                submitText={lang.deletePromptText}
                submitType='outline-danger'
                show={ProductsStore.isDeleteWindowOpen}
                onClose={() => ProductsStore.onCloseWindow()}
                onSubmit={() => ProductsStore.onDeleteProduct()}
            >{`Вы действительно хотите удалить продукт "${ProductsStore.selectedProduct.name}"?`}</PromptModal>

            <PromptModal
                title={lang.editProduct}
                submitText={lang.saveText}
                submitType='outline-info'
                show={ProductsStore.isEditWindowOpen}
                onClose={() => ProductsStore.onCloseWindow()}
                onSubmit={() => (ProductsStore.isEditWindowOpen = false)}
            >
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Название</Form.Label>
                        <Form.Control type="text" value={ProductsStore.selectedProduct.name} />
                    </Form.Group>
                </Form>
            </PromptModal>
        </>
    )
}))

export default Products