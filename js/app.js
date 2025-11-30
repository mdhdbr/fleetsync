document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    const breadcrumbCurrent = document.getElementById('breadcrumb-current');

    // Simulate Loading
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        app.classList.remove('hidden');

        // Handle initial hash or default to dashboard
        handleNavigation();
    }, 1500);

    // Navigation Handling
    window.addEventListener('hashchange', handleNavigation);

    function handleNavigation() {
        const hash = window.location.hash.slice(1) || 'dashboard';

        // Update Nav Items
        navItems.forEach(item => {
            if (item.dataset.page === hash) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Pages
        pages.forEach(page => {
            if (page.id === `${hash}-page`) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });

        // Update Header
        const title = hash.charAt(0).toUpperCase() + hash.slice(1);
        pageTitle.textContent = title === 'Ridesync' ? 'RideSync' :
            title === 'Logisync' ? 'LogiSync' : title;
        breadcrumbCurrent.textContent = pageTitle.textContent;

        // Refresh map if it exists (fix for Leaflet rendering in hidden tabs)
        if (window.FleetSyncMap && typeof window.FleetSyncMap.refresh === 'function') {
            setTimeout(() => {
                window.FleetSyncMap.refresh();
            }, 100);
        }
    }

    // Add click handlers for nav items to ensure smooth transitions
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Allow default anchor behavior to update hash
            // The hashchange event will handle the UI updates
        });
    });

    // Search functionality (Mock)
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                alert(`Searching for: ${searchInput.value}\n(Search functionality coming soon)`);
            }
        });
    }

    // Quick Action Buttons (Mock)
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.querySelector('span').textContent;
            alert(`${action} feature coming soon!`);
        });
    });
});
