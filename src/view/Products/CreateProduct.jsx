import React from "react";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";
import {Button, Form, InputGroup, Stack} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import Money from '../../../public/icons/money.svg';
import Options from "../../components/Options";
import {runInAction} from "mobx";

const CreateProduct = inject("ProductsStore")(observer(({ProductsStore}) => (
        <ModalWindow
            title={ProductsStore.selected ? ProductsStore.selected.name : lang.createProduct}
            submitText={lang.saveText}
            submitType='outline-info'
            disableSave={!ProductsStore.newProduct.checkRequiredFields()}
            show={ProductsStore.isModifyProductWindowOpen}
            onClose={() => ProductsStore.onCloseWindow()}
            onSubmit={() => ProductsStore.onModifyProduct()}
        >
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.product.name}</Form.Label>
                    <Form.Control
                        type="text"
                        value={ProductsStore.newProduct?.name}
                        onChange={event => runInAction(() => (ProductsStore.newProduct.name = event.target.value))}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.product.category}</Form.Label>
                    <Form.Select
                        required
                        value={ProductsStore.newProduct?.category}
                        onChange={event => runInAction(() => (ProductsStore.newProduct.category = event.target.value))}
                    >
                        <option value={null}>--</option>
                        { ProductsStore.categories.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label><div className='required'/>{lang.product.price}</Form.Label>
                    <InputGroup>
                        <InputGroup.Text><Money/></InputGroup.Text>
                        <Form.Control
                            type="number"
                            value={ProductsStore.newProduct?.price}
                            onChange={event => runInAction(() => (ProductsStore.newProduct.price = event.target.value))}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.product.image}</Form.Label>
                    <p className='hint'>{lang.imagesHint}</p>
                    <Form.Control
                        type="file"
                        multiple
                        onChange={event => ProductsStore.checkImages([...event.target.files])}
                    />
                </Form.Group>
                { ProductsStore.newProduct?.images.length > 0 &&
                    <>
                        <Button
                            variant="outline-danger"
                            size='sm'
                            style={{marginBottom: 10}}
                            onClick={() => ProductsStore.clearImages()}>
                            { lang.removeImages }
                        </Button>
                        <p className='hint-warning'>{lang.imagesEditHint}</p>
                        { ProductsStore.newProduct?.id &&
                            <Stack direction="horizontal">
                                <p className='hint'>&#128504; {ProductsStore.newProduct?.images.map(img => img.name).join(', ')}</p>
                            </Stack>
                        }
                    </>
                }
                <Form.Group className="mb-3">
                    <Form.Label>{lang.product.badge}</Form.Label>
                    <Form.Control
                        type="text"
                        value={ProductsStore.newProduct?.badge}
                        onChange={event => runInAction(() => (ProductsStore.newProduct.badge = event.target.value))}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.product.description}</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={ProductsStore.newProduct?.description}
                        onChange={event => runInAction(() => (ProductsStore.newProduct.description = event.target.value))}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>{lang.product.options}</Form.Label>
                    <br/>
                    <Options
                        defaultOptions={ProductsStore.newProduct.options}
                        onChange={options => runInAction(() => (ProductsStore.newProduct.options = options))}
                    />
                </Form.Group>
            </Form>
        </ModalWindow>
)))

export default CreateProduct