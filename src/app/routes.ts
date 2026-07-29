import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import ProjetPage from "./pages/ProjetPage";
import BlogArticlePage from "./pages/BlogArticlePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "projets/:slug", Component: ProjetPage },
      { path: "journal/:slug", Component: BlogArticlePage },
    ],
  },
]);
