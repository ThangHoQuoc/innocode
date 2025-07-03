// src/js/main.js
// Ensure this file is loaded after Leaflet.js

// Immediately invoked function to avoid globals
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if Leaflet loaded
    if (typeof L === 'undefined') {
      console.error('Leaflet library not loaded.');
      return;
    }

    // Initialize map
    const map = L.map('map', {
      center: [21.0278, 105.8342], // Default coords
      zoom: 13,
      zoomControl: true,
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Sample points; replace with fetch('/api/points') in production
    const points = [
      { id: 1, name: 'Point A', coords: [21.030, 105.835], type: 'green' },
      { id: 2, name: 'Point B', coords: [21.028, 105.830], type: 'red' },
      { id: 3, name: 'Point C', coords: [21.025, 105.839], type: 'yellow' },
    ];

    // Color mapping
    const colors = {
      green: '#10B981',
      red: '#EF4444',
      yellow: '#F59E0B',
      default: '#3B82F6'
    };

    // Add markers for each point
    points.forEach(pt => {
      const marker = L.circleMarker(pt.coords, {
        radius: 8,
        fillColor: colors[pt.type] || colors.default,
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.9,
      }).addTo(map);

      marker.bindPopup(`
        <div class="font-medium text-blue-600">${pt.name}</div>
        <div class="text-sm">Type: ${pt.type}</div>
      `);
    });

    // Optional: fit map to markers bounds
    const group = new L.featureGroup(points.map(pt => L.circleMarker(pt.coords)));
    map.fitBounds(group.getBounds().pad(0.2));
  });
})();
