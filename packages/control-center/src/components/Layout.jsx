import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
