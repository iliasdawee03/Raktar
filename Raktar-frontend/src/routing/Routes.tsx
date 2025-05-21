import Login from "../pages/Login.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import ForgotPassword from "../pages/Forgot.tsx";
import Complaint from "../pages/Complaint.tsx";
import Product from "../pages/Product.tsx";
import Order from "../pages/Order.tsx";
import Profile from "../pages/Profile.tsx";
import OrderUpdate from "../pages/OrderUpdate.tsx";
import Register from "../pages/Register.tsx";
import SupplierOrders from "../pages/SupplierOrders.tsx";
import SupplierDeliveryForm from "../pages/SupplierDeliveryForm.tsx";
import WarehouseStorage from "../pages/WarehouseStorage.tsx";
import OrderDelivery from "../pages/OrderDelivery.tsx";
import WarehouseForm from "../pages/WarehouseForm.tsx";
import StorageView from "../pages/StorageView.tsx";
import CarrierAssign from "../pages/CarrierAssign.tsx";
import AllComplaints from "../pages/AllComplaints.tsx";

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
            {
                path : "supplierorders",
                component : <SupplierOrders/>,
                isPrivate : true,
                title : "Beszálítói Rendelések",
            },
            {
                path: "supplierdeliveryform",
                component: <SupplierDeliveryForm/>,
                isPrivate: true,
                title: "Szállítói Áruszállítási Űrlap",
            },
            {
                path:"warehousedelivery",
                component : <WarehouseStorage/>,
                isPrivate : true,
                title : "Raktár fuvar",
            },
            {
                path:"orderdelivery",
                component : <OrderDelivery/>,
                isPrivate : true,
                title : "Kiszállítás",
            },
            {
                path:"warehouseforms",
                component: <WarehouseForm/>,
                isPrivate: true,
                title : "Raktárba érkezett fuvar",
            },
            {
                path : "storage",
                component : <StorageView/>,
                isPrivate : true,
                title : "Tárhely kezelés",
            },
            {
                path: "assign",
                component : <CarrierAssign/>,
                isPrivate : true,
                title : "Futárok osztása",
            },
            {
                path: "allcomplaints",
                component : <AllComplaints/>,
                isPrivate : true,
                title : "Összes panasz",
            },
        ],
    },
    {
        path : "/forgot",
        component : <ForgotPassword/>,
        isPrivate : false,
        title : "Elfelejtett jelszó",
    },
    {
        path: "/register",
        component : <Register/>,
        isPrivate : false,
        title : "Regisztráció",
    },
]