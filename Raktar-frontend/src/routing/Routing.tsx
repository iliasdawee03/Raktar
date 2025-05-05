import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth.tsx";
import { routes } from "./Routes.tsx";
import { ReactElement } from "react";
import Dashboard from "../pages/Dashboard.tsx";


const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const { isLoggedIn } = useAuth();
  console.log("isLoggedIn:", isLoggedIn); 
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const Routing = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {routes.map((route) =>
        route.isPrivate ? (
          <Route
            key={route.path}
            path={route.path}
            element={<PrivateRoute element={route.component} />}
          />
        ) : (
          <Route key={route.path} path={route.path} element={route.component} />
        )
      )}
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      <Route path="/dashboard" element={<Dashboard/>}>  
        <Route path="complaint" element={<PrivateRoute element={<Dashboard/>} />} />
        <Route path="order" element={<PrivateRoute element={<Dashboard/>} />} />
        <Route path="product" element={<PrivateRoute element={<Dashboard/>} />} />
      </Route>
    </Routes>
  );
};

export default Routing;