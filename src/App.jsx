import React, {useEffect} from 'react';
import {Route, Routes, Navigate} from "react-router-dom";
import {inject, observer} from "mobx-react";
import {Container} from "react-bootstrap";
import {Navibar} from "./components/Navibar";
import Auth from "./view/Auth/Auth";
import Home from "./view/Home/Home";
import Products from "./view/Products/Products";
import Contacts from "./view/Contacts/Contacts";
import './App.scss'


const App = inject('AuthStore')(observer(({AuthStore}) => {

    useEffect(() => {
        AuthStore.autoLogin()
    })

    const links = [
        {'label': 'Каталог', 'to': '/products', 'status': ''},
        {'label': 'Заказы', 'to': '/orders', 'status': 'disabled'},
        {'label': 'Задачи', 'to': '/tasks', 'status': 'disabled'},
        {'label': 'Контакты', 'to': '/contacts', 'status': ''},
        {'label': 'Шаблоны', 'to': '/templates', 'status': 'disabled'},
        {'label': 'Статистика', 'to': '/statistics', 'status': 'disabled'},
    ]

    return (
        <Container fluid className='App'>
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
                                <Route index path="/contacts" element={<Contacts/>}/>
                                <Route path="*" render={() => <Navigate replace to="/" element={<Home/>}/>}/>
                            </>
                        )
                }
                </Routes>
            </main>
        </Container>
    );

}));

export default App;