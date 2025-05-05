import Login from "../pages/Login.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import ForgotPassword from "../pages/Forgot.tsx";

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
    },
    {
        path : "/forgot",
        component : <ForgotPassword/>,
        isPrivate : false,
        title : "Elfelejtett jelszó",
    },
]