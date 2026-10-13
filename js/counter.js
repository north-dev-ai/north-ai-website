// Simple privacy-respecting visitor counter
// Uses localStorage, no external tracking, no personal data

(function() {
    'use strict';
    
    const COUNTER_KEY = 'north_visitor_count';
    const LAST_VISIT_KEY = 'north_last_visit';
    const UNIQUE_ID_KEY = 'north_visitor_id';
    
    // Generate simple unique ID if doesn't exist
    function getOrCreateVisitorId() {
        let id = localStorage.getItem(UNIQUE_ID_KEY);
        if (!id) {
            id = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(UNIQUE_ID_KEY, id);
        }
        return id;
    }
    
    // Check if this is a new visit (not just page refresh)
    function isNewVisit() {
        const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
        const now = Date.now();
        const hourInMs = 60 * 60 * 1000;
        
        if (!lastVisit || (now - parseInt(lastVisit)) > hourInMs) {
            localStorage.setItem(LAST_VISIT_KEY, now.toString());
            return true;
        }
        return false;
    }
    
    // Increment counter if new visit
    function incrementCounter() {
        if (isNewVisit()) {
            const currentCount = parseInt(localStorage.getItem(COUNTER_KEY) || '0');
            const newCount = currentCount + 1;
            localStorage.setItem(COUNTER_KEY, newCount.toString());
            return newCount;
        }
        return parseInt(localStorage.getItem(COUNTER_KEY) || '0');
    }
    
    // Track page view
    function trackPageView() {
        const visitorId = getOrCreateVisitorId();
        const count = incrementCounter();
        const page = window.location.pathname;
        
        // Log to console for debugging (no external calls)
        console.log('North Analytics:', {
            visitor: visitorId,
            visits: count,
            page: page,
            timestamp: new Date().toISOString()
        });
        
        return count;
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageView);
    } else {
        trackPageView();
    }
    
    // Expose counter for display
    window.NorthAnalytics = {
        getVisitCount: function() {
            return parseInt(localStorage.getItem(COUNTER_KEY) || '0');
        },
        getVisitorId: function() {
            return getOrCreateVisitorId();
        }
    };
})();
