import React from "react";
import {Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import ModalWindow from "../../components/ModalWindow";
import {lang} from "../../lang";

const CreateCategory = inject("ProductsStore")(observer(({ProductsStore}) => (
    <ModalWindow
        title={ProductsStore.selected ? ProductsStore.selected.name : lang.createCategory}
        submitText={lang.saveText}
        submitType='outline-info'
        disableSave={!ProductsStore.newCategory.checkRequiredFields()}
        show={ProductsStore.isModifyCategoryWindowOpen}
        onClose={() => ProductsStore.onCloseWindow()}
        onSubmit={() => ProductsStore.onModifyCategory()}
    >
        <Form.Group className="mb-3">
            <Form.Label><div className='required'/>{lang.category.name}</Form.Label>
            <Form.Control
                type="text"
                value={ProductsStore.newCategory?.name}
                onChange={event => runInAction(() => (ProductsStore.newCategory.name = event.target.value))}
            />
        </Form.Group>
    </ModalWindow>
)))

export default CreateCategory