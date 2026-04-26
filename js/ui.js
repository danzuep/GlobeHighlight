// Manages the DOM, formatting for the modal, and the star background.
import { store } from './state.js';

export function initStars() {
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const stars = Array.from({ length: 400 }, () => ({ 
        x: Math.random() * canvas.width, 
        y: Math.random() * canvas.height, 
        size: Math.random() * 1.2, 
        opacity: Math.random() 
    }));
    stars.forEach(s => { 
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`; 
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill(); 
    });
}

export function setupEventListeners() {
    window.addEventListener('stateChange', (e) => {
        if (e.detail.prop === 'selected' || e.detail.prop === 'colors') {
            if (window.world) window.world.polygonCapColor(window.world.polygonCapColor());
        }
        if (e.detail.prop === 'selected') {
            updateSelectionUI();
        }
        if (e.detail.prop === 'showLabels') {
            document.getElementById('show-labels').checked = e.detail.value;
            if (window.world) window.world.polygonCapColor(window.world.polygonCapColor());
        }
    });

    // Panel Toggle
    document.getElementById('toggle-panel').onclick = () => 
        document.getElementById('panel').classList.toggle('closed');

    // Color Inputs
    document.getElementById('color-hl').oninput = (e) => {
        store.state.colors = { ...store.state.colors, hl: e.target.value };
    };
    document.getElementById('hl-alpha').oninput = (e) => {
        store.state.colors = { ...store.state.colors, alpha: parseFloat(e.target.value) };
    };

    // Labels Checkbox
    document.getElementById('show-labels').onchange = (e) => {
        store.state.showLabels = e.target.checked;
        if (window.world) window.world.polygonCapColor(window.world.polygonCapColor());
    };

    // Modal Logic
    document.getElementById('btn-edit').onclick = () => {
        document.getElementById('modalArea').value = getFormattedText();
        document.getElementById('editModal').style.display = 'block';
    };
    
    document.getElementById('btn-close').onclick = () => 
        document.getElementById('editModal').style.display = 'none';

    document.getElementById('btn-copy').onclick = () => {
        navigator.clipboard.writeText(document.getElementById('modalArea').value);
    };

    document.getElementById('btn-apply').onclick = () => {
        const val = document.getElementById('modalArea').value.trim();
        const fmt = document.getElementById('ioFormat').value;
        let list = [];
        if (fmt === 'json') list = JSON.parse(val || "[]");
        else if (fmt === 'csv') list = val.split(',').map(s => s.trim());
        else list = val.split('\n').map(s => s.trim().replace(/^\d+\.\s+/, ''));
        
        store.state.selected = new Set(list.filter(s => s));
        document.getElementById('editModal').style.display = 'none';
    };
}

export function updateSelectionUI() {
    const list = [...store.state.selected].sort();
    document.getElementById('count').innerText = list.length;
    document.getElementById('selection-list').innerHTML = list.map(n => `<div>${n}</div>`).join('');
}

export function getFormattedText() {
    const fmt = document.getElementById('ioFormat').value;
    const list = [...store.state.selected].sort();
    if (fmt === 'json') return JSON.stringify(list, null, 2);
    if (fmt === 'csv') return list.join(', ');
    if (fmt === 'newline') return list.join('\n');
    return list.map((n, i) => `${i + 1}. ${n}`).join('\n');
}