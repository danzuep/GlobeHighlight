// Handle fetches with Abort signals to prevent race conditions
let controller = null;

export async function loadGeoData(res) {
    if (controller) controller.abort();
    controller = new AbortController();

    // const url = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_${res}_admin_0_countries.geojson`;
    const url = `./assets/ne_${res}_admin_0_countries.geojson`;

    try {
        // Pointing to your local assets folder
        const response = await fetch(url, { 
            signal: controller.signal 
        });
        return await response.json();
    } catch (err) {
        if (err.name !== 'AbortError') console.error("Fetch error:", err);
        return null;
    }
}