import React from "react";
import {inject, observer} from "mobx-react";
import {Button, DropdownButton, Form, InputGroup, Stack} from "react-bootstrap";
import {runInAction} from "mobx";
import {lang} from "../../lang";
import Multiselect from "../../components/Multiselect";
import Search from '../../../public/icons/search.svg';

const OrdersToolbar = inject('OrdersStore')(observer(({OrdersStore}) => {
   return (
       <Stack direction="horizontal" gap={4} style={{flexWrap: 'wrap'}}>
           <Form.Select
               style={{maxWidth: 180, cursor: 'pointer'}}
               onChange={e => runInAction(() => {
                   OrdersStore.filters.sorting = e.target.value
                   OrdersStore.filterOrders()
               })}
           >
               <option value={null}>{lang.sorting.default}</option>
               <option value='edit'>{lang.sorting.edit}</option>
           </Form.Select>
           <DropdownButton variant="light" title={lang.order.status}>
               <Multiselect
                   style={{padding: 10}}
                   items={OrdersStore.statuses}
                   onChange={checked => runInAction(() => {
                       OrdersStore.filters.checkedStatuses = checked
                       OrdersStore.filterOrders()
                   })}
                   checked={OrdersStore.filters.checkedStatuses}
               />
           </DropdownButton>
           <InputGroup style={{maxWidth: 300}} >
               <Button
                   style={{width: 50}}
                   variant="outline-success"
                   disabled={!OrdersStore.filters.searchText.trim()}
                   onClick={() => runInAction(() => {
                       OrdersStore.filters.searching = true
                       OrdersStore.filterOrders()
                   })}>
                   <Search/>
               </Button>
               <Form.Control
                   placeholder={lang.findOrder}
                   type='text'
                   value={OrdersStore.filters.searchText}
                   onChange={event => runInAction(() => {OrdersStore.filters.searchText = event.target.value.toLowerCase()})}
               />
               { (OrdersStore.filters.searchText.trim() || OrdersStore.filters.searching) &&
                   <Button
                       style={{width: 50}}
                       variant="outline-danger"
                       onClick={() => runInAction(() => {
                           OrdersStore.filters.searching = false
                           OrdersStore.filters.searchText = ''
                           OrdersStore.filterOrders()
                       })}>
                       <span>&#215;</span>
                   </Button>
               }
           </InputGroup>
       </Stack>
   )
}))

export default OrdersToolbar