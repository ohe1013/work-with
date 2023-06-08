import Error from "./pages/Error";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";

const routes = [
    {
        path: "/",
        element: <Layout />,
        errorElement: <Error />,
        children: [
            { path: "/", element: <Home /> },
            {
                path: "login",
                element: <Login />,
            },
        ],
    },
];

export { routes };
