import {Suspense, useEffect, useState} from 'react'
import './App.scss'
import Loader from "./Components/Loader/Loader.jsx";
import Menu from "./Page/Menu/Menu.jsx";
import {useDispatch, useSelector} from "react-redux";

import axios from "axios";
import {url} from "./Config.jsx";
import {Route, Routes} from "react-router-dom";
import Reviews from "./Page/Reviews/Reviews.jsx";
import Book from "./Page/Book/Book.jsx";

function App() {

    const tg = window.Telegram.WebApp;
    const chat_id = tg?.initDataUnsafe?.user?.id ? tg?.initDataUnsafe?.user?.id : 6300322161
    tg.expand()
    const dispatch = useDispatch()
    useEffect(() => {
        const getuserLanguage = async () => {
            const {data} = await axios.post(
                `${url}/api/v1/admin/getUserLanguage`,
                {chat_id},
                {withCredentials: true}
            );
            dispatch({type: "SET_LANGUAGE", payload: data})
            dispatch({type: "SET_CHAT_ID", payload: chat_id})
        }

        getuserLanguage()


    }, []);

    const routes = [
        {
            link: '/',
            element: <><Loader/><Menu/></>,
        },
        {
            link: '/reviews',
            element:<><Loader/><Reviews/></>,
        },
        {
            link: '/book',
            element:<>
                <Loader/>
                <Book/>
            </>,
        },
        {
            link: '/book/:id',
            element:<>
                <Loader/>
                <Book/>
            </>,
        },
    ];

    return (
        <>
            <div className="App">
                <Routes>
                    {routes.map(route => (
                        <Route
                            key={route.link}
                            path={route.link}
                            element={
                                <Suspense>
                                    {route.element}
                                </Suspense>
                            }
                        />
                    ))}
                </Routes>
            </div>
        </>
    );
}

export default App
