import Dashboard from "@/components/dashboard";
import { ProtectedRoute } from "@/routes/protected-route";
import { LoginPage } from "@/pages/login";
import NotFoundPage from "@/pages/not-found";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: "*",
    element: <LoginPage />,
  },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
