import Login from "../pages/Login.tsx";
import Dashboard from "../pages/Dashboard.tsx";

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
]