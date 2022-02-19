import React, {useEffect} from 'react';
import {Route, Routes, Navigate, Outlet} from "react-router-dom";
import {inject, observer} from "mobx-react";

import Auth from "./view/Auth/Auth";
import AuthService from "./service/AuthService";
import Home from "./view/Home/Home";

import {Navibar} from "./components/Navibar";
import {Footer} from "./components/Footer";
import './App.scss'
import Products from "./view/Products/Products";


const App = inject('AuthStore')(observer(({AuthStore}) => {

    useEffect(() => {
        AuthStore.autoLogin()
    })

    const links = [
        {'label': 'Каталог', 'to': '/products', 'status': ''},
        {'label': 'Заказы', 'to': '/orders', 'status': 'disabled'},
        {'label': 'Задачи', 'to': '/tasks', 'status': 'disabled'},
        {'label': 'Контакты', 'to': '/contacts', 'status': 'disabled'},
        {'label': 'Шаблоны', 'to': '/templates', 'status': 'disabled'},
        {'label': 'Статистика', 'to': '/statistics', 'status': 'disabled'},
    ]

    return (
        <div className='App'>
            <Navibar links={links} auth={!!AuthStore.token} logout={() => AuthStore.logout()}/>
            <main>
            <Routes>

            {
                !AuthStore.token
                    ? (
                        <> <Route index path="/" element={<Home/>}/>
                            <Route path="/auth" element={<Auth/>}/>
                            <Route path="/*" render={() => <Navigate replace to="/" element={<Home/>}/>}/>
                        </>
                    )
                    : (
                        <>
                            <Route index path="/" element={<Home/>}/>
                            <Route index path="/products" element={<Products/>}/>
                            <Route path="*" render={() => <Navigate replace to="/" element={<Home/>}/>}/>
                        </>
                    )
            }
            </Routes>


            </main>

            <Footer />
        </div>
    );

}));

export default App;