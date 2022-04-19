import React from "react";
import {DropdownButton, Stack} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {runInAction} from "mobx";
import Multiselect from "../../components/Multiselect";
import Select from "../../components/Select";
import {lang} from "../../lang";

const ProductsToolbar = inject("ProductsStore")(observer(({ProductsStore}) => (
        <Stack direction="horizontal" gap={2} style={{flexWrap: 'wrap'}}>
            <Select
                items={ProductsStore.sorting}
                currentItem={ProductsStore.filters.sorting}
                onChange={current => runInAction(() => {
                    ProductsStore.filters.sorting = current
                    ProductsStore.filterProducts()
                })}
            />
            <DropdownButton
                variant="light"
                title={lang.categories}
            >
                <Multiselect
                    style={{padding: 10, maxHeight: 200}}
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