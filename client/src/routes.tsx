import Error from "./pages/Error";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { PageEnum } from "./enum/page";

const routes = [
  {
    element: <Layout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home />, label: PageEnum.HOME },
      {
        path: "/login",
        element: <Login />,
        label: PageEnum.AUTH,
      },
      {
        path: "/regist",
        element: <Home />,
        label: PageEnum.REGIST,
      },
      {
        path: "/find",
        element: <Home />,
        label: PageEnum.FIND,
      },
    ],
  },
];

export { routes };
