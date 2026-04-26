// Function to help UI components subscribe to changes
export const store = {
    state: new Proxy({
        selected: new Set(JSON.parse(localStorage.getItem('globe.data') || '[]')),
        colors: { 
            hl: localStorage.getItem('globe.highlight.colour') || '#ffd700', 
            alpha: parseFloat(localStorage.getItem('globe.highlight.alpha')) || 0.6 
        },
        resolution: '110m',
        pov: JSON.parse(localStorage.getItem('globe.pov') || '{"lat":45,"lng":10,"altitude":1.0}'),
        showLabels: JSON.parse(localStorage.getItem('globe.showLabels') || 'true')
    }, {
        set(target, prop, value) {
            target[prop] = value;
            // Persistent storage
            if (prop === 'selected') {
                localStorage.setItem('globe.data', JSON.stringify([...value]));
            }
            if (prop === 'colors') {
                localStorage.setItem('globe.highlight.colour', value.hl);
                localStorage.setItem('globe.highlight.alpha', value.alpha);
            }
            if (prop === 'pov') {
                localStorage.setItem('globe.pov', JSON.stringify(value));
            }
            if (prop === 'showLabels') {
                localStorage.setItem('globe.showLabels', JSON.stringify(value));
            }
            // Emit a custom event so other files can react to state changes
            window.dispatchEvent(new CustomEvent('stateChange', { detail: { prop, value } }));
            return true;
        }
    })
};

export function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1, 3), 16), 
          g = parseInt(hex.slice(3, 5), 16), 
          b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
}