import React from "react";
import {Outlet} from "react-router-dom";
import {Container} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import Navibar from "../components/Navibar";
import {lang} from "../lang";

const Layout = inject('AuthStore')(observer(({AuthStore}) => {

    const links = [
        {'label': lang.products, 'to': '/products'},
        {'label': lang.orders, 'to': '/orders'},
        {'label': lang.tasks, 'to': '/tasks'},
        {'label': lang.contacts, 'to': '/contacts'},
        {'label': lang.statistics, 'to': '/statistics'},
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