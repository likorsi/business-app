import React from "react";
import Navibar from "../components/Navibar";
import {Outlet} from "react-router-dom";
import {Container} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import {lang} from "../lang";

const Layout = inject('AuthStore')(observer(({AuthStore}) => {


    const links = [
        {'label': lang.products, 'to': '/products', 'status': ''},
        {'label': lang.orders, 'to': '/orders', 'status': ''},
        {'label': lang.tasks, 'to': '/tasks', 'status': ''},
        {'label': lang.contacts, 'to': '/contacts', 'status': ''},
        {'label': lang.templates, 'to': '/templates', 'status': 'disabled'},
        {'label': lang.statistics, 'to': '/statistics', 'status': 'disabled'},
    ]


    return (
        <Container fluid className='App'>
            <Navibar
                links={links}
                auth={!!AuthStore.token}
                logout={() => AuthStore.logout()}
            />
            <main>
                <Outlet />
            </main>
        </Container>
    )
}))

export default Layout