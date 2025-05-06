import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth.tsx";
import { routes } from "./Routes.tsx";
import { ReactElement } from "react";


const PrivateRoute = ({ element }: { element: ReactElement }) => {
  const { isLoggedIn } = useAuth();
  console.log("isLoggedIn:", isLoggedIn); 
  return isLoggedIn ? element : <Navigate to="/login" />;
};

interface RouteType {
  path: string;
  component: ReactElement;
  isPrivate?: boolean;
  children?: RouteType[];
}

const renderRoutes = (routes: RouteType[]) => {
  return routes.map((route) => {
    if (route.children) {
      // Ha vannak nested route-ok
      return (
        <Route
          key={route.path}
          path={route.path}
          element={route.isPrivate ? <PrivateRoute element={route.component} /> : route.component}
        >
          {renderRoutes(route.children)} {/* Rekurzív feldolgozás */}
        </Route>
      );
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={route.isPrivate ? <PrivateRoute element={route.component} /> : route.component}
      />
    );
  });
};


const Routing = () => {
  const { isLoggedIn , isLoading} = useAuth();

  if (isLoading) { return null; }

  return (
    <Routes>
      {renderRoutes(routes)}
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};


export default Routing;