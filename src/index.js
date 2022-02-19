import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "mobx-react";

import App from './App';
import Store from "./store/Store";

render(
    <Provider {...Store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);