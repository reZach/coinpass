import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Splashscreen from './splashscreen';
import Input from './input';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: "/start",
    element: <Splashscreen />
  },
  {
    path: "/coinpass",
    element: <App />
  },
  {
    path: "/input",
    element: <Input />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
