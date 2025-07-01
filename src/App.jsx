import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import "./App.css";

function Layout() {
	// Selama tahap development bisa comment ini dulu sementara
	// Jika user logout maka tidak bisa akses endpoint lain
	// const access_token = localStorage.getItem("access_token");
	// if (!access_token) {
	// 	return <Navigate to="/login" />;
	// }
	return (
		<div>
			{/* <Navbar /> // Jika ada Navbar nantinya */}
			<Outlet />
		</div>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<h1>Landing page...</h1>} />
				<Route path="/login" element={<h1>Login page...</h1>} />
				<Route element={<Layout />}>
					<Route path="/chats" element={<h1>Chat page...</h1>} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
