import { useEffect } from "react";
import { useNavigate } from "react-router";

const LandingPage = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Smooth scrolling for navigation links
		const handleSmoothScroll = (e) => {
			const href = e.target.getAttribute("href");
			if (href && href.startsWith("#")) {
				e.preventDefault();
				const target = document.querySelector(href);
				if (target) {
					target.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}
			}
		};

		// Add scroll effect to navbar
		const handleNavbarScroll = () => {
			const nav = document.querySelector("nav");
			if (nav) {
				if (window.scrollY > 50) {
					nav.classList.add("navbar-blur-scrolled");
					nav.classList.remove("navbar-blur");
				} else {
					nav.classList.add("navbar-blur");
					nav.classList.remove("navbar-blur-scrolled");
				}
			}
		};

		// Parallax effect for floating elements
		const handleParallax = () => {
			const scrolled = window.pageYOffset;
			const parallax = document.querySelectorAll(".parallax");

			parallax.forEach((element) => {
				const speed = element.dataset.speed || 0.5;
				const yPos = -(scrolled * speed);
				element.style.transform = `translateY(${yPos}px)`;
			});
		};

		// Add event listeners
		document.addEventListener("click", handleSmoothScroll);
		window.addEventListener("scroll", handleNavbarScroll);
		window.addEventListener("scroll", handleParallax);

		// Cleanup
		return () => {
			document.removeEventListener("click", handleSmoothScroll);
			window.removeEventListener("scroll", handleNavbarScroll);
			window.removeEventListener("scroll", handleParallax);
		};
	}, []);

	const handleLogin = () => {
		navigate("/login");
	};

	return (
		<div className="scroll-smooth">
			{/* Navigation */}
			<nav className="fixed w-full top-0 navbar-blur z-50 border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">G</span>
							</div>
							<span className="text-xl font-bold gradient-text">Greets</span>
						</div>

						<div className="hidden md:flex items-center space-x-8">
							<a
								href="#features"
								className="text-gray-600 hover:text-purple-600 transition-colors"
							>
								Features
							</a>
							<a
								href="#about"
								className="text-gray-600 hover:text-purple-600 transition-colors"
							>
								About
							</a>
						</div>

						<div className="flex items-center space-x-4">
							<button
								onClick={handleLogin}
								className="btn-gradient text-white px-6 py-2 rounded-full"
							>
								Login
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="gradient-bg hero-pattern min-h-screen flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 bg-black/10"></div>

				{/* Floating Elements */}
				<div className="absolute top-20 left-10 w-16 h-16 bg-white/20 rounded-full animate-float"></div>
				<div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full animate-float-delayed"></div>
				<div className="absolute bottom-40 left-20 w-12 h-12 bg-white/15 rounded-full animate-float"></div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					<div className="max-w-4xl mx-auto">
						<h1 className="hero-title text-5xl md:text-7xl font-bold text-black mb-6 animate-pulse-slow">
							Connect with
							<span className="block text-yellow-300">Everyone</span>
						</h1>

						<p className="hero-subtitle text-xl md:text-2xl text-black/90 mb-8 max-w-2xl mx-auto leading-relaxed">
							Greets is a modern chat application that allows you to communicate
							easily, quickly, and securely with friends, family, and
							colleagues.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
							<button
								onClick={handleLogin}
								className="btn-white-gradient px-8 py-4 rounded-full font-semibold shadow-lg"
							>
								Get Started
							</button>
						</div>

					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
							Main <span className="gradient-text">Features</span>
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Discover why millions choose Greets for everyday communication.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* Feature 1 */}
						<div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-gray-100">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl feature-icon mb-6">
								<span className="text-white text-xl">💬</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">
								Real-Time Chat
							</h3>
							<p className="text-gray-600 leading-relaxed">
								Enjoy ultra-fast and responsive messaging. Your messages are
								delivered in seconds.
							</p>
						</div>

						{/* Feature 2 */}
						<div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-gray-100">
							<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl feature-icon mb-6">
								<span className="text-white text-xl">👥</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">
								Group Chat
							</h3>
							<p className="text-gray-600 leading-relaxed">
								Create groups with many members. Manage teams, families, or
								communities with ease.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-gray-100">
							<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl feature-icon mb-6">
								<span className="text-white text-xl">🔒</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">
								End-to-End Encryption
							</h3>
							<p className="text-gray-600 leading-relaxed">
								Your messages are private — only you and the recipient can read
								them.
							</p>
						</div>

						{/* Feature 4 */}
						<div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-gray-100">
							<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl feature-icon mb-6">
								<span className="text-white text-xl">🤖</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">
								AI Assistant
							</h3>
							<p className="text-gray-600 leading-relaxed">
								Ask questions, get instant answers, or summarize chats with
								built-in AI support.
							</p>
						</div>

						{/* Feature 5 */}
						<div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-gray-100">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl feature-icon mb-6">
								<span className="text-white text-xl">📝</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">
								Chat Summarization
							</h3>
							<p className="text-gray-600 leading-relaxed">
								Summarize long group or personal chats in one click. Perfect for
								catching up quickly.
							</p>
						</div>

						{/* Feature 6 */}
						<div className="bg-white p-8 rounded-2xl shadow-lg card-hover border border-gray-100">
							<div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl feature-icon mb-6">
								<span className="text-white text-xl">💡</span>
							</div>
							<h3 className="text-xl font-semibold text-gray-900 mb-3">
								Clean & Intuitive Interface
							</h3>
							<p className="text-gray-600 leading-relaxed">
								Designed for all users — simple, modern, and easy to navigate.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* About Section */}
			<section id="about" className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
								Why Choose <span className="gradient-text">Greets?</span>
							</h2>
							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								We believe that good communication is the key to success. Greets
								is here to make it easy for you to connect with the most
								important people in your life.
							</p>

							<div className="space-y-6">
								<div className="flex items-start space-x-4">
									<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
										<span className="text-green-600 text-sm">✓</span>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-1">
											Simple & Powerful
										</h3>
										<p className="text-gray-600">
											Greets offers essential chat features you need from
											personal and group conversations to smart AI tools all in
											a clean, intuitive interface.
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
										<span className="text-green-600 text-sm">✓</span>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-1">
											Real-Time Messaging
										</h3>
										<p className="text-gray-600">
											Enjoy fast, uninterrupted communication across personal
											and group chats, powered by{" "}
											<code className="bg-gray-100 px-1 rounded">
												Socket.IO
											</code>{" "}
											for a truly real-time experience. Messages are delivered
											instantly, keeping conversations smooth and responsive.
										</p>
									</div>
								</div>

								<div className="flex items-start space-x-4">
									<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
										<span className="text-green-600 text-sm">✓</span>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-1">
											AI-Powered Assistant
										</h3>
										<p className="text-gray-600">
											Get instant answers by chatting directly with AI in
											dedicated rooms. Whether you're asking questions or
											summarizing long chat threads, our AI tools help you stay
											focused and save time with just one click.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="relative">
							<div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl p-8 text-white">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 bg-white/20 rounded-full"></div>
											<div>
												<div className="font-semibold">Development Team</div>
												<div className="text-sm text-white/80">Online</div>
											</div>
										</div>
										<div className="text-white/60">10:30</div>
									</div>

									<div className="bg-white/10 rounded-2xl p-4">
										<p className="text-sm">
											"Greets has completely changed the way we communicate. Its
											so easy and secure!"
										</p>
									</div>

									<div className="bg-white/20 rounded-2xl p-4 ml-8">
										<p className="text-sm">
											"Thank you! We're glad Greets is helping boost your team's
											productivity"
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 gradient-bg">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						Ready to Get Started with Greets?
					</h2>
					<p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
						Join millions of users who have experienced the best chat experience
						with Greets.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={handleLogin}
							className="btn-white-gradient px-8 py-4 rounded-full font-semibold shadow-lg"
						>
							Sign Up Now — Free!
						</button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-white pt-1">
				<div className="border-t border-gray-800 mt-1 pt-5 text-center text-gray-400">
					<p>
						&copy; 2025 Greets. All rights reserved. Developed by the Greets
						Team.
					</p>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
