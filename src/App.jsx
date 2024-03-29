import React from 'react';
import {Route, Routes} from "react-router-dom";
import {inject, observer} from "mobx-react";
import Auth from "./view/Auth/Auth";
import Home from "./view/Home/Home";
import Products from "./view/Products/Products";
import Contacts from "./view/Contacts/Contacts";
import Layout from "./view/Layout";
import PublicPage from "./view/Public/PublicPage";
import Profile from "./view/Profile/Profile";
import Orders from "./view/Orders/Orders";
import Tasks from "./view/Tasks/Tasks";
import Statistics from "./view/Statistics/Statistics";
import './App.scss';

const App = inject('AuthStore')(observer(({AuthStore}) => (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>}/>
                <Route path="users/:user/*" element={<PublicPage/>}/>
                <Route path="*" element={<Home/>}/>
                {
                    !AuthStore.token
                        ?
                            <>
                                <Route path="/auth/*" element={<Auth/>}/>
                                <Route path="*" element={<Home/>}/>
                            </>
                        :
                            <>
                                <Route path="/products/*" element={<Products/>}/>
                                <Route path="/orders/*" element={<Orders/>}/>
                                <Route path="/tasks/*" element={<Tasks/>}/>
                                <Route path="/contacts/*" element={<Contacts/>}/>
                                <Route path="/statistics/*" element={<Statistics/>}/>
                                <Route path="/profile/*" element={<Profile/>}/>
                                <Route path="*" element={<Products/>}/>
                            </>
                }
            </Route>
        </Routes>
)))

export default App