import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/Login';
import { AuthProvider } from '../src/context/AuthContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
}));

describe('Login Component', () => {
    const renderLogin = () => {
        return render(
            <BrowserRouter>
                <AuthProvider>
                    <Login />
                </AuthProvider>
            </BrowserRouter>
        );
    };

    test('renders login form', () => {
        renderLogin();

        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    test('displays demo credentials', () => {
        renderLogin();

        expect(screen.getByText(/Admin: admin \/ pass/i)).toBeInTheDocument();
        expect(screen.getByText(/Driver: driver \/ pass/i)).toBeInTheDocument();
    });

    test('allows user to type in username and password', () => {
        renderLogin();

        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'pass' } });

        expect(usernameInput.value).toBe('admin');
        expect(passwordInput.value).toBe('pass');
    });

    test('form has required fields', () => {
        renderLogin();

        const usernameInput = screen.getByLabelText(/Username/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        expect(usernameInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });
});
