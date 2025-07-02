import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

export default function LoginPage() {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:3000/login", {
				username,
				password,
			});

			const { access_token } = response.data;
			localStorage.setItem("access_token", access_token);

			Swal.fire({
				icon: "success",
				title: "Login Successful",
				text: "Welcome back!",
			});

			navigate("/chats");
		} catch (err) {
			console.log(err);

			Swal.fire({
				icon: "error",
				title: "Login Failed",
				text: "Invalid username or password",
			});
		}
	};

	return (
		<div className="min-h-screen gradient-bg hero-pattern flex items-center justify-center relative overflow-hidden">
			{/* Background overlay */}
			<div className="absolute inset-0 bg-black/10"></div>

			{/* Floating Elements */}
			<div className="absolute top-20 left-10 w-16 h-16 bg-white/20 rounded-full animate-float"></div>
			<div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-float-delayed"></div>
			<div className="absolute bottom-40 left-20 w-12 h-12 bg-white/15 rounded-full animate-float"></div>
			<div className="absolute top-1/2 right-10 w-8 h-8 bg-white/25 rounded-full animate-float"></div>

			{/* Login Card */}
			<div className="relative z-10 w-full max-w-md mx-4">
				<div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 card-hover border border-white/20">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
								<Link to="/">
									<img
										src="src/assets/G-logo.png"
										alt="Greets Logo"
										className="w-10 h-10 object-contain"
									/>
								</Link>
							</div>
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Welcome to <span className="gradient-text">Greets</span>
						</h1>
						<p className="text-gray-600">
							Log in to continue your conversation
						</p>
					</div>

					{/* Login Form */}
					<form onSubmit={handleLogin} className="space-y-6">
						{/* Username Input */}
						<div className="space-y-2">
							<label
								htmlFor="username"
								className="block text-sm font-semibold text-gray-700"
							>
								Username
							</label>
							<div className="relative">
								<input
									type="text"
									id="username"
									name="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
									placeholder="Enter your username"
									required
								/>
								<div className="absolute inset-y-0 right-0 pr-3 flex items-center"></div>
							</div>
						</div>

						{/* Password Input */}
						<div className="space-y-2">
							<label
								htmlFor="password"
								className="block text-sm font-semibold text-gray-700"
							>
								Password
							</label>
							<div className="relative">
								<input
									type="password"
									id="password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
									placeholder="Enter your password"
									required
								/>
							</div>
						</div>

						{/* Login Button */}
						<button
							type="submit"
							className="w-full btn-gradient text-white py-3 px-4 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
						>
							<span className="animate-pulse">Login</span>
						</button>
					</form>

					{/* Divider */}
					<div className="flex items-center my-6">
						<div className="flex-1 border-t border-gray-200"></div>
						<span className="px-4 text-sm text-gray-500 bg-white">
							or continue with
						</span>
						<div className="flex-1 border-t border-gray-200"></div>
					</div>

					{/* Social Login Buttons */}
					<div className="grid grid-cols-2 gap-3">
						<button className="flex items-center justify-center space-x-2 w-full py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 card-hover">
							<span className="text-xl">🔍</span>
							<span className="text-sm font-medium text-gray-700">Google</span>
						</button>
						<button className="flex items-center justify-center space-x-2 w-full py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 card-hover">
							<span className="text-xl">📘</span>
							<span className="text-sm font-medium text-gray-700">
								Facebook
							</span>
						</button>
					</div>

					{/* Sign Up Link */}
					<div className="text-center mt-6">
						<p className="text-gray-600">
							Don't have an account?{" "}
							<a
								href="/login"
								className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
							>
								Sign up for free
							</a>
						</p>
					</div>
				</div>
			</div>

		</div>
	);
}
