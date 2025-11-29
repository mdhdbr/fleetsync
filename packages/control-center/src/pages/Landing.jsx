import { Link } from 'react-router-dom';
import CookieConsent from '../components/CookieConsent';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed w-full z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">F</div>
                        <span className="text-xl font-bold tracking-tight">FleetSync</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <Link to="/login" className="text-white hover:text-blue-400 transition-colors">Login</Link>
                        <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-300 text-sm font-medium">
                            🚀 The Future of Fleet Management
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
                            Unified Ride-Hailing + Logistics + WMS
                        </h1>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            One platform to manage your entire operation. From last-mile delivery to warehouse optimization and driver dispatch.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                            >
                                Open Control Center
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </Link>
                            <a
                                href="http://localhost:3001"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-lg transition-all border border-slate-700 flex items-center justify-center gap-2"
                            >
                                Driver App
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </a>
                            <Link
                                to="/shipper-portal"
                                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-lg transition-all border border-slate-700 flex items-center justify-center gap-2"
                            >
                                Shipper Portal
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-12 border-y border-slate-800 bg-slate-900/50">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Trusted by industry leaders</p>
                    <div className="flex flex-wrap justify-center gap-12 grayscale">
                        {/* Placeholder Logos */}
                        <div className="text-2xl font-bold text-slate-400">LOGISTICS CORP</div>
                        <div className="text-2xl font-bold text-slate-400">FAST FREIGHT</div>
                        <div className="text-2xl font-bold text-slate-400">GLOBAL SHIP</div>
                        <div className="text-2xl font-bold text-slate-400">URBAN MOVERS</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Complete Fleet Intelligence</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Three powerful modules integrated into one seamless platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* RideSync Card */}
                        <div className="group relative bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 bg-blue-900/50 rounded-xl flex items-center justify-center text-3xl mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                🚗
                            </div>
                            <h3 className="text-2xl font-bold mb-4">RideSync</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                Advanced ride-hailing management with real-time dispatching, surge pricing, and driver performance analytics.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">✓</span> Smart Dispatching
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">✓</span> Live Tracking
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-blue-500">✓</span> Driver App
                                </li>
                            </ul>
                        </div>

                        {/* LogiSync Card */}
                        <div className="group relative bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-900/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 bg-emerald-900/50 rounded-xl flex items-center justify-center text-3xl mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                                📦
                            </div>
                            <h3 className="text-2xl font-bold mb-4">LogiSync</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                End-to-end logistics management for last-mile delivery, route optimization, and proof of delivery.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-2">
                                    <span className="text-emerald-500">✓</span> Route Optimization
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-emerald-500">✓</span> Proof of Delivery
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-emerald-500">✓</span> Fleet Maintenance
                                </li>
                            </ul>
                        </div>

                        {/* WMS Card */}
                        <div className="group relative bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-900/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-14 h-14 bg-purple-900/50 rounded-xl flex items-center justify-center text-3xl mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                                🏭
                            </div>
                            <h3 className="text-2xl font-bold mb-4">WMS</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                Warehouse management system for inventory tracking, order fulfillment, and space utilization.
                            </p>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-500">✓</span> Inventory Tracking
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-500">✓</span> Order Picking
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-purple-500">✓</span> Barcode Scanning
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Screenshots Section */}
            <section className="py-24 bg-slate-800/30">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Dashboard for Total Control</h2>
                            <p className="text-lg text-slate-400 mb-8">
                                Get a bird's eye view of your entire operation. Monitor vehicles, drivers, and shipments in real-time with our intuitive dashboard.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold">1</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Real-time Map View</h4>
                                        <p className="text-slate-400 text-sm">Track every vehicle's location and status instantly.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold">2</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Performance Analytics</h4>
                                        <p className="text-slate-400 text-sm">Deep dive into fleet efficiency and driver metrics.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 relative">
                            {/* Placeholder for Screenshot */}
                            <div className="aspect-video bg-slate-800 rounded-xl border border-slate-700 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10"></div>
                                <div className="text-slate-500 font-medium flex flex-col items-center gap-2">
                                    <span className="text-4xl">🖥️</span>
                                    <span>Dashboard Screenshot</span>
                                </div>
                            </div>
                            {/* Floating Element */}
                            <div className="absolute -bottom-6 -left-6 bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-xl hidden md:block">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-sm font-bold">System Status</span>
                                </div>
                                <div className="text-xs text-slate-400">All systems operational</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 py-12 border-t border-slate-900">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">F</div>
                                <span className="text-xl font-bold">FleetSync</span>
                            </div>
                            <p className="text-slate-500 text-sm">
                                The ultimate platform for modern fleet management and logistics operations.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-white">RideSync</a></li>
                                <li><a href="#" className="hover:text-white">LogiSync</a></li>
                                <li><a href="#" className="hover:text-white">WMS</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-white">About Us</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
                        <p>© {new Date().getFullYear()} FleetSync. All rights reserved.</p>
                        <p className="mt-2 text-xs">Serving Saudi Arabia - Riyadh, Jeddah, Dammam, Mecca, and Medina</p>
                    </div>
                </div>
            </footer>

            <CookieConsent />
        </div>
    );
};

export default Landing;
