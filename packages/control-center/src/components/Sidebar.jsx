import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard', roles: ['admin', 'dispatcher', 'driver'] },
        { path: '/vehicles', icon: '🚛', label: 'Vehicles', roles: ['admin', 'dispatcher'] },
        { path: '/drivers', icon: '👨‍✈️', label: 'Drivers', roles: ['admin', 'dispatcher'] },
        { path: '/analytics', icon: '📈', label: 'Analytics', roles: ['admin', 'dispatcher'] },
        { path: '/wms', icon: '🏭', label: 'Warehouse', roles: ['admin', 'dispatcher'] },
        { path: '/alert-settings', icon: '⚙️', label: 'Alert Settings', roles: ['admin', 'dispatcher'] },
        { path: '/shipper-portal', icon: '📦', label: 'Shipper Portal', roles: ['admin', 'dispatcher'] },
    ];

    const filteredMenuItems = menuItems.filter((item) =>
        item.roles.includes(user?.role || 'driver')
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-slate-900 text-white flex flex-col h-screen">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
                        F
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">FleetSync</h1>
                        <p className="text-xs text-slate-400">Pro ERP</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-sm">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400 capitalize">{user?.role || 'driver'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
