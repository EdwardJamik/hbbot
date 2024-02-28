import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Rtl from "./pages/Rtl.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn.jsx";
import Main from "./components/layout/Main.jsx";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import {Suspense} from "react";
import {ProtectedRoute} from "./ProtectedRoute.jsx";
import Filling from "./pages/Filling.jsx";
import TgUsers from "./pages/TgUsers.jsx";
import Category from "./pages/Category.jsx";
import Product from "./pages/Product.jsx";
import Reservation from "./pages/Reservation.jsx";
import SelectedFilling from "./pages/SelectedFilling.jsx";
import Reviews from "./pages/Reviews.jsx";
import UsersChat from "./pages/UsersChat.jsx";
import Chat from "./pages/Chat.jsx";
import KnowledgeBase from "./pages/KnowledgeBase.jsx";

function App() {
    const routes = [
        {
            link: '/sign-in',
            element: <ProtectedRoute element={<SignIn/>}/>,
        },
        {
            link: '/',
            element:<ProtectedRoute element={<Main><Home/></Main>}/>,
        },
        {
            link: '/users',
            element: <ProtectedRoute element={<Main><TgUsers/></Main>}/>,
        },
        {
            link: '/product',
            element: <ProtectedRoute element={<Main><Category/></Main>}/>,
        },
        {
            link: '/reservation',
            element: <ProtectedRoute element={<Main><Reservation/></Main>}/>,
        },
        {
            link: '/product/:id',
            element: <ProtectedRoute element={<Main><Product/></Main>}/>,
        },
        {
            link: '/feedback',
            element: <ProtectedRoute element={<Main><Reviews/></Main>}/>,
        },
        {
            link: '/chatGPT',
            element: <ProtectedRoute element={<Main><UsersChat/></Main>}/>,
        },
        {
            link: '/chatGPT/knowledgeBase',
            element: <ProtectedRoute element={<Main><KnowledgeBase/></Main>}/>,
        },
        {
            link: '/chatGPT/:id',
            element: <ProtectedRoute element={<Main><Chat/></Main>}/>,
        },
        {
            link: '/filling',
            element: <ProtectedRoute element={<Main><SelectedFilling/></Main>}/>,
        },
        {
            link: '/filling/bot',
            element: <ProtectedRoute element={<Main><Filling/></Main>}/>,
        },
        {
            link: '/filling/webapp',
            element: <ProtectedRoute element={<Main><Filling/></Main>}/>,
        },
        {
            link: '/rtl',
            element: <ProtectedRoute element={<Main><Rtl/></Main>}/>,
        },
        {
            link: '/profile',
            element: <ProtectedRoute element={<Main><Profile/></Main>}/>,
        },
        {
            link: '*',
            element: <ProtectedRoute element={<Main><Home/></Main>}/>,
        },
        // {
        //     link: '/',
        //     element: <ProtectedRoute element={<Dashboard />} />,
        // }
    ];
    return (
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
    );
}

export default App;