import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import ProjetPage from "./pages/ProjetPage";
import BlogArticlePage from "./pages/BlogArticlePage";
import AllArticlesPage from "./pages/AllArticlesPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "projets/:slug", Component: ProjetPage },
      { path: "journal", Component: AllArticlesPage },
      { path: "journal/:slug", Component: BlogArticlePage },
    ],
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/admin",
    Component: AdminPage,
  },
]);
