import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Tables from "./pages/Tables.jsx";
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
import Settings from "./pages/Settings.jsx";
import Product from "./pages/Product.jsx";

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
            link: '/product/:id',
            element: <ProtectedRoute element={<Main><Product/></Main>}/>,
        },
        {
            link: '/settings',
            element: <ProtectedRoute element={<Main><Settings/></Main>}/>,
        },
        {
            link: '/filling',
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