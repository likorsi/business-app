import React from "react";
import {Button, DropdownButton, Form, Stack, Dropdown} from "react-bootstrap";
import Multiselect from "../../components/Multiselect";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import {lang} from "../../lang";

const ProductsToolbar = inject("ProductsStore")(observer(({ProductsStore}) => {

    return (
        <Stack direction="horizontal" gap={4} style={{flexWrap: 'wrap', marginBottom: 15}}>
            <DropdownButton variant="light" title={lang.categories}>
                <Multiselect style={{padding: 10}} items={ProductsStore.categories} onChange={checked => runInAction(() => (ProductsStore.checkedCategories = checked))} checked={ProductsStore.checkedCategories} />
            </DropdownButton>
            <Form.Check
                type="switch"
                label={lang.showProductsWithBadge}
            />
            <Form.Select style={{maxWidth: 180}} onChange={e => console.log(e.target.value)}>
                <option value="default">{lang.sorting.byCreate}</option>
                <option value="az">{lang.sorting.AZ}</option>
                <option value="za">{lang.sorting.ZA}</option>
            </Form.Select>
            <Button variant="outline-primary" type="submit" className='ms-auto'>{lang.findText}</Button>
        </Stack>
    )
}))

export default ProductsToolbar