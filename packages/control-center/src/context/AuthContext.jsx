import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('fleetsync_token'));
    const [loading, setLoading] = useState(true);

    // Configure axios defaults
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('fleetsync_token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('fleetsync_token');
        }
    }, [token]);

    // Hydrate user state on load
    useEffect(() => {
        const storedUser = localStorage.getItem('fleetsync_user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password,
            });

            const { user, token } = response.data;

            setUser(user);
            setToken(token);
            localStorage.setItem('fleetsync_user', JSON.stringify(user));

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('fleetsync_user');
        localStorage.removeItem('fleetsync_token');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
