import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Link, Redirect, Switch} from 'react-router-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk'

import { rootReducer } from './src/reducers';

import Main from './src/scenes/Main';
import Login from './src/scenes/Login';
import LoadingScreen from './src/components/LoadingScreen';
import PrivateRoute from './src/components/PrivateRoute';

import { cardsDownloaded, fetchCards } from './src/actions';
import { doFetch } from './src/actions/user';
import { composeWithDevTools } from 'redux-devtools-extension';

import style from './src/styles/main.scss';
import AdminManager from "./src/scenes/AdminManager";
import { SITE_TITLE } from './variables'
import Favicon from 'react-favicon';

// const composeEnhancers =
//   typeof window === 'object' &&
//   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//       // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
//     }) : compose;

// const enhancer = composeEnhancers(
//   applyMiddleware(thunkMiddleware)
// );

// const store = createStore(
//   rootReducer,
//   enhancer
// );

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
);

store.dispatch(doFetch());


const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            <div>
                <div>
                    <Favicon url="./static/icons8-quest-40.png"/>
                </div>
                <Switch>
                    <Route exact path="/adminmanager" component={AdminManager}/>
                    <PrivateRoute exact path="/" component={Main}/>
                    <Route path="/login" component={Login}/>
                </Switch>
            </div>
        </Router>
    </Provider>
);

document.title = SITE_TITLE;

window.onload = function() {
  ReactDOM.render(
    <Root store={store} />,
    document.getElementById("root")
  );
};