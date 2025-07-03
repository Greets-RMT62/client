import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RoomChat from "./pages/RoomChat";

function Layout() {
  // Selama tahap development bisa comment ini dulu sementara
  // Jika user logout maka tidak bisa akses endpoint lain
  // const access_token = localStorage.getItem("access_token");
  // if (!access_token) {
  // 	return <Navigate to="/login" />;
  // }
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      {/* <Navbar /> // Jika ada Navbar nantinya */}
      <Outlet />
    </div>
  );
}

function LoginLayout() {
  if (localStorage.getItem("access_token")) {
    return <Navigate to="/chats" />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/chats" element={<RoomChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
