import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Categories from "./components/Categories";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Packages from "./components/Packages";
import BookPackage from "./components/BookPackage";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import MyBookings from "./components/MyBookings";
import Login from "./components/Login";
import Register from "./components/Register";
import BookNow from "./components/BookNow";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import Dasboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/users";
import AdminCategories from "./admin/pages/Categories";
import AdminPackages from "./admin/pages/Packages";
import AdminGallery from "./admin/pages/Gallery";
import AdminReviews from "./admin/pages/Reviews";
import AdminBookings from "./admin/pages/Bookings";
import AdminPackageBookings from "./admin/pages/PackageBookings";
import AdminSettings from "./admin/pages/Settings";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminServices from "./admin/pages/Services";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<BookNow />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<BookPackage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dasboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/packages"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPackages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/package-bookings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPackageBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminServices />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;