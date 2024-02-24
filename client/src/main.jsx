import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {createStore} from "redux";
import { BrowserRouter } from "react-router-dom";
import {Provider} from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));

const defaultState = {
    language: 'en',
    category: null,
    chat_id: null
}

const reducer = (state = defaultState, action) =>{
    switch (action.type){
        case "SET_LANGUAGE":
            return {...state, language: `${action.payload}`}
        case "SET_CATEGORY":
            return {...state, category: `${action.payload}`}
        case "SET_CHAT_ID":
            return {...state, chat_id: `${action.payload}`}
        default:
            return state
    }
}

const store = createStore(reducer)

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);