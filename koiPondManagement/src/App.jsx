import React from "react";
import Elements from "./components/elements/HomePage";
import Introduction from "./components/elements/IntroductionPage";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./components/page/register";
import Dashboard from "./dashboard";
import MainLayout from "./layout";
import LoginPage from "./components/page/login";
// Change this line to match the correct path and filename of your Profile component

import Category from "./components/page/admin/category";
import UserManagement from "./components/page/admin/manage-user";
import ManageUser from './components/page/admin/manage-user';

import Consulting from "./components/page/admin/consulting/request";
import RequestConsulting from "./components/page/admin/consulting/request";
import ConsultingOrders from "./components/page/admin/consulting/order";
import ServicePage from "./components/page/Service/ServicePage";
import OrdersList from "./components/page/admin/manage-product";

import Profile from "./components/profile/Profile";
import MaintenancePage from "./components/page/maintenance/MaintenancePage";
import GardenDesignForm from "./components/page/GardenDesignForm/GardenDesignForm";
import ConstructionPage from "./components/page/constructionquote/ConstructionPage";
import Blog from "./components/page/Blog/Blog";
import BlogPage from "./components/page/Blog/BlogPage";

// Pond Deisgn
import DesignProject from "./components/page/admin/ponddesign/designproject";
import PondDesign from "./components/page/admin/ponddesign/PondDesign";
import PondDesignColumns from "./components/page/admin/PondDesignColumns/PondDesignColumns";
import ProjectDetails from "./components/Project/Detail";
import ProjectPage from "./components/Project/ProjectPage";
import DesignBlog from "./components/page/admin/ponddesign/DesignBlog";

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Elements />,
        },
        {
          path: "/gioithieu",
          element: <Introduction />,
        },
        {
          path: "/profile",
          element: <Profile/>,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/duan",
          element: <ProjectPage />,
        },
        {
          path: "/duan/:id",
          element: <ProjectDetails />,
        },
        {
          path: "/blog/:id",
          element: <Blog/>,
        },
        {
          path: "/blog",
          element: <BlogPage />,
        },     
        {
          path: "/thiconghocakoi",
          element: <ServicePage />,
        },
        {
          path: "/baogiathicong",
          element: <ConstructionPage />,
        },
        {
          path: "/lapthietketheoyeucau",
          element: <GardenDesignForm />,
        },
    
        {
          path: "/baogiabaoduong",
          element: <MaintenancePage />,
        }      
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "dashboard",
      element: <ProtectedRoute allowedRoles={[1, 2, 3, 4]} />,
      children: [
        { path: "",
          element: <Dashboard />,
          children: [
            {
              path: "category",
              element: <Category />,
            },
            {
              path: "usermanagement",
              element: <UserManagement/>,
            },
            {
              path: "ponddesign",
              element: <PondDesign/>,
            },
            {
              path: "designproject",
              element: <DesignProject/>,
            },
            {
              path: "designblog",
              element: <DesignBlog/>,
            },
            {
              path: "ponddesigncolumns",
              element: <PondDesignColumns/>,
            },
            {
              path: "orderlist",
              element: <OrdersList/>,
            },
            {
              path: "consulting",
              children: [
                {
                  path: "requests",
                  element: <RequestConsulting />,
                },
                {
                  path: "orders",
                  element: <ConsultingOrders />,
                },
              ],
            },
            // {
            //   path: "sevice",
            //   element: <Sevice />,
            // },
          ],
        },
      ],
    },
    {
      path: "/admin/manage-users",
      element: <ManageUser />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
