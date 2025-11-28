import { mockData } from './store.js';

console.log('Mock Data Loaded:', mockData ? 'Yes' : 'No');
if (mockData) {
    console.log('Trips:', mockData.trips?.length);
    console.log('Vehicles:', mockData.vehicles?.length);
}
