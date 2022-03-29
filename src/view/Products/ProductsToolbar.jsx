import React from "react";
import {DropdownButton, Form, Stack} from "react-bootstrap";
import Multiselect from "../../components/Multiselect";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import {lang} from "../../lang";

const ProductsToolbar = inject("ProductsStore")(observer(({ProductsStore}) => (
        <Stack direction="horizontal" gap={4} style={{flexWrap: 'wrap'}}>
            <Form.Select
                style={{maxWidth: 180, cursor: 'pointer'}}
                onChange={e => runInAction(() => {
                    ProductsStore.filters.sorting = e.target.value
                    ProductsStore.filterProducts()
                })}
            >
                <option value={null}>{lang.sorting.default}</option>
                <option value="az">{lang.sorting.AZ}</option>
                <option value="za">{lang.sorting.ZA}</option>
            </Form.Select>
            <DropdownButton variant="light" title={lang.categories}>
                <Multiselect
                    style={{padding: 10}}
                    items={ProductsStore.categories}
                    untitledItem={lang.noCategory}
                    onDelete={item => runInAction(() => {
                        ProductsStore.selected = item
                        ProductsStore.isDeleteWindowOpen = true
                    })}
                    onEdit={item => runInAction(() => {
                        ProductsStore.selected = item
                        ProductsStore.newCategory.init(item)
                        ProductsStore.isModifyCategoryWindowOpen = true
                    })}
                    onChange={checked => runInAction(() => {
                        ProductsStore.filters.checkedCategories = checked
                        ProductsStore.filterProducts()
                    })}
                    checked={ProductsStore.filters.checkedCategories}
                />
            </DropdownButton>
        </Stack>
)))

export default ProductsToolbar