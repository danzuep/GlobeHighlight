// Initialize the Globe and tie state changes to visual rendering
import Globe from 'globe.gl';
import { store, hexToRgba } from './state.js';
import { loadGeoData } from './api.js';
import * as ui from './ui.js';

const version = 'V37';

let world;

async function init() {
    ui.initStars();
    
    world = Globe()(document.getElementById('globeViz'))
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl('./assets/earth-blue-marble.jpg')
        .showAtmosphere(false)
        .polygonAltitude(0.01)
        .polygonSideColor(() => 'rgba(0,0,0,0.1)')
        .polygonStrokeColor(() => '#222')
        .polygonCapColor(d => {
            const name = d.properties.NAME || d.properties.ADMIN;
            return store.state.selected.has(name) 
                ? hexToRgba(store.state.colors.hl, store.state.colors.alpha) 
                : 'rgba(120,120,120,0.12)';
        })
        .polygonLabel(d => {
            if (!store.state.showLabels) return null;
            const name = d.properties.NAME || d.properties.ADMIN;
            // const iso = d.properties.ISO_A3 || d.properties.ADM0_A3 || d.properties.GU_A3 || d.properties.ISO_A2;
            return `<div class="globe-label">${name}</div>`;
        })
        .onPolygonClick(d => {
            const name = d.properties.NAME || d.properties.ADMIN;
            const newSet = new Set(store.state.selected);
            newSet.has(name) ? newSet.delete(name) : newSet.add(name);
            // Trigger Proxy
            store.state.selected = newSet;
            store.state.pov = world.pointOfView();
        });

    // Handle resolution changes
    world.controls().addEventListener('change', async () => {
        const { lat, lng, altitude } = world.pointOfView();
        document.getElementById('status-bar').innerText = `${version} // LAT: ${lat.toFixed(2)} LNG: ${lng.toFixed(2)} ALT: ${altitude.toFixed(2)}`;
        
        const targetRes = altitude < 0.2 ? '50m' : '110m';
        if (store.state.resolution !== targetRes) {
            store.state.resolution = targetRes;
            const data = await loadGeoData(targetRes);
            if (data) world.polygonsData(data.features);
        }
    });

    // Initial Data Load
    const initialData = await loadGeoData('110m');
    world.polygonsData(initialData.features);

    world.pointOfView(store.state.pov, 0);

    window.world = world;

    ui.setupEventListeners();
    ui.updateSelectionUI();
}

init();