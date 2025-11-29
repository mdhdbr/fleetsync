export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({ from: '2025-11-20', to: '2025-11-26' });

    useEffect(() => {
        fetchAnalytics();
    }, [dateRange]);

    const fetchAnalytics = async () => {
        try {
            const res = await axios.get(`${API_URL}/reports/usage`, {
                params: dateRange
            });
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    const exportToCSV = (dataArray, filename) => {
        if (!dataArray || dataArray.length === 0) return;

        const headers = Object.keys(dataArray[0]).join(',');
        const rows = dataArray.map(obj => Object.values(obj).join(','));
        const csv = [headers, ...rows].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-600">Loading analytics...</div>
            </div>
        );
    }

    const kpis = {
        activeVehicles: 4,
        tripsToday: 12,
        deadKm: data?.dead_km.reduce((sum, d) => sum + d.km, 0) || 0,
        utilization: Math.round(data?.utilization.reduce((sum, d) => sum + d.percentage, 0) / data?.utilization.length || 0),
        revenuePerKm: 12.5
    };

    return (
        <Layout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
                    <p className="text-slate-600 mt-1">Fleet performance metrics and insights</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium uppercase mb-2">Active Vehicles</p>
                        <p className="text-3xl font-bold text-blue-600">{kpis.activeVehicles}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium uppercase mb-2">Trips Today</p>
                        <p className="text-3xl font-bold text-green-600">{kpis.tripsToday}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium uppercase mb-2">Dead KM</p>
                        <p className="text-3xl font-bold text-orange-600">{kpis.deadKm}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium uppercase mb-2">Utilization</p>
                        <p className="text-3xl font-bold text-purple-600">{kpis.utilization}%</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 text-sm font-medium uppercase mb-2">Revenue/KM</p>
                        <p className="text-3xl font-bold text-indigo-600">SAR {kpis.revenuePerKm}</p>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Utilization Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Fleet Utilization</h3>
                            <button
                                onClick={() => exportToCSV(data.utilization, 'utilization')}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                                Export CSV
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={data?.utilization || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Dead KM Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Dead Kilometers</h3>
                            <button
                                onClick={() => exportToCSV(data.dead_km, 'dead_km')}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                                Export CSV
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data?.dead_km || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="km" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Profitability Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Profitability Trend</h3>
                            <button
                                onClick={() => exportToCSV(data.profitability, 'profitability')}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                                Export CSV
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={data?.profitability || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                                <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Hub Throughput Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Hub Throughput</h3>
                            <button
                                onClick={() => exportToCSV(data.hub_throughput, 'hub_throughput')}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                                Export CSV
                            </button>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data?.hub_throughput || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hub" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="inbound" fill="#3b82f6" />
                                <Bar dataKey="outbound" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Report Templates */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Report Templates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
                            <h4 className="font-semibold text-slate-800">Daily Operations</h4>
                            <p className="text-sm text-slate-500 mt-1">All trips, utilization, and alerts</p>
                        </button>
                        <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
                            <h4 className="font-semibold text-slate-800">Financial Summary</h4>
                            <p className="text-sm text-slate-500 mt-1">Revenue, costs, and profitability</p>
                        </button>
                        <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
                            <h4 className="font-semibold text-slate-800">Fleet Report</h4>
                            <p className="text-sm text-slate-500 mt-1">Vehicle stats and maintenance</p>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
