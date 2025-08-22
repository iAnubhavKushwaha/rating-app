import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import { Navbar } from "./components/Navbar";
import { Signup } from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import BrowseStores from "./components/BrowseStores";
import { AdminDashboard } from "./pages/AdminDashboard";
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { ManageUsers } from "./pages/ManageUsers";
import { ManageStores } from "./pages/ManageStores";
import { UserDetails } from "./pages/UserDetails";
import { StoreDetails } from "./pages/StoreDetails";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginHomePage } from "./pages/LoginHomePage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavbarWithUser />
        <Routes>
          <Route path="/" element={<LoginHomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/browseStores" element={<BrowseStores />} />
          <Route path="/dashboard" element={
            <ProtectedRoute roles={["NORMAL"]}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ManageUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/stores" element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ManageStores />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/:id" element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UserDetails />
            </ProtectedRoute>
          } />
          <Route path="/admin/stores/:id" element={
            <ProtectedRoute roles={["ADMIN"]}>
              <StoreDetails />
            </ProtectedRoute>
          } />
          <Route path="/owner/dashboard" element={
            <ProtectedRoute roles={["OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

const NavbarWithUser = () => {
  const { user } = useAuth();
  return user ? <Navbar /> : null;
};

export default App;