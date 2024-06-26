import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Map from "./pages/map";
import Home from "./pages/home";
import Action from "./pages/action";
import AddCity from "./pages/addcity";
import Stats from "./pages/stats";
import About from "./pages/about";
import Faq from "./pages/faq";
import { createHashRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/map",
    element: <Map />
  },
  {
    path: "/action",
    element: <Action />
  },
  {
    path: "/addcity",
    element: <AddCity />
  },
  {
    path: "/stats",
    element: <Stats />
  },
  {
    path: "/about",
    element: <About />
  },
  {
    path: "/faq",
    element: <Faq />
  }
]);

const basename = document.querySelector("base")?.getAttribute("href") ?? "/"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RouterProvider router={router} basename={basename} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
