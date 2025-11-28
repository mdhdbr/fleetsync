import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import AlertsWidget from '../src/components/AlertsWidget';

// Mock axios and socket.io-client
jest.mock('axios');
jest.mock('socket.io-client', () => {
    return jest.fn(() => ({
        on: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
    }));
});

describe('AlertsWidget Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders alerts widget', () => {
        axios.get.mockResolvedValue({ data: [] });

        render(<AlertsWidget />);

        expect(screen.getByText(/Active Alerts/i)).toBeInTheDocument();
        expect(screen.getByText(/All/i)).toBeInTheDocument();
        expect(screen.getByText(/High/i)).toBeInTheDocument();
        expect(screen.getByText(/Critical/i)).toBeInTheDocument();
    });

    test('displays no alerts message when empty', async () => {
        axios.get.mockResolvedValue({ data: [] });

        render(<AlertsWidget />);

        await waitFor(() => {
            expect(screen.getByText(/No active alerts/i)).toBeInTheDocument();
        });
    });

    test('displays alerts when data is present', async () => {
        const mockAlerts = [
            {
                id: 'alert_1',
                type: 'speeding',
                severity: 'high',
                message: 'Vehicle veh_1 exceeded speed limit',
                vehicle_id: 'veh_1',
                status: 'active',
                created_at: new Date().toISOString(),
            },
        ];

        axios.get.mockResolvedValue({ data: mockAlerts });

        render(<AlertsWidget />);

        await waitFor(() => {
            expect(screen.getByText(/speeding/i)).toBeInTheDocument();
            expect(screen.getByText(/Vehicle veh_1 exceeded speed limit/i)).toBeInTheDocument();
        });
    });

    test('filters alerts by severity', async () => {
        const mockAlerts = [
            {
                id: 'alert_1',
                type: 'speeding',
                severity: 'high',
                message: 'High severity alert',
                status: 'active',
                created_at: new Date().toISOString(),
            },
            {
                id: 'alert_2',
                type: 'fatigue',
                severity: 'critical',
                message: 'Critical severity alert',
                status: 'active',
                created_at: new Date().toISOString(),
            },
        ];

        axios.get.mockResolvedValue({ data: mockAlerts });

        render(<AlertsWidget />);

        await waitFor(() => {
            expect(screen.getByText(/High severity alert/i)).toBeInTheDocument();
            expect(screen.getByText(/Critical severity alert/i)).toBeInTheDocument();
        });

        // Click High filter
        const highButton = screen.getByRole('button', { name: /High/i });
        fireEvent.click(highButton);

        await waitFor(() => {
            expect(screen.getByText(/High severity alert/i)).toBeInTheDocument();
            expect(screen.queryByText(/Critical severity alert/i)).not.toBeInTheDocument();
        });
    });

    test('acknowledges alert on button click', async () => {
        const mockAlerts = [
            {
                id: 'alert_1',
                type: 'speeding',
                severity: 'high',
                message: 'Test alert',
                status: 'active',
                created_at: new Date().toISOString(),
            },
        ];

        axios.get.mockResolvedValue({ data: mockAlerts });
        axios.post.mockResolvedValue({ data: { success: true } });

        render(<AlertsWidget />);

        await waitFor(() => {
            expect(screen.getByText(/Test alert/i)).toBeInTheDocument();
        });

        const acknowledgeButton = screen.getByRole('button', { name: /Acknowledge/i });
        fireEvent.click(acknowledgeButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/alerts/acknowledge'),
                expect.objectContaining({ alertId: 'alert_1' })
            );
        });
    });
});
