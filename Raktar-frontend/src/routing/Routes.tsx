import Login from "../pages/Login.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import ForgotPassword from "../pages/Forgot.tsx";
import Complaint from "../pages/Complaint.tsx";
import Product from "../pages/Product.tsx";
import Order from "../pages/Order.tsx";
import Profile from "../pages/Profile.tsx";
import OrderUpdate from "../pages/OrderUpdate.tsx";

export const routes = [
    {
        path: "/login",
        component: <Login/>,
        isPrivate: false,
        title: "Bejelentkezés",
    },
    {
        path: "/dashboard",
        component: <Dashboard/>,
        isPrivate: true,
        title: "Kezdőlap",
        children: [
            {
                path : "complaint",
                component : <Complaint/>,
                isPrivate : true,
                title : "Visszajelzés",
            },
            {
                path : "product",
                component : <Product/>,
                isPrivate : true,
                title : "Termékek",
            },
            {
                path : "order",
                component : <Order/>,
                isPrivate : true,
                title : "Rendelés",
            },
            {
                path: "orderupdate",
                component : <OrderUpdate/>,
                isPrivate : true,
                title : "Rendelés frissítése",
            },
            {
                path : "profile",
                component : <Profile/>,
                isPrivate : true,
                title : "Profil",
            },
        ],
    },
    {
        path : "/forgot",
        component : <ForgotPassword/>,
        isPrivate : false,
        title : "Elfelejtett jelszó",
    },
]