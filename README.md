# Globe Highlight

A modular, high-performance 3D globe visualization tool built with `globe.gl`. This project allows users to explore a 3D globe, select regions, and export their selection data in various formats. The initial target use case is for people to visualise the countries they have travelled to.

## Key Features
* **Modular Architecture:** Clean separation of concerns (State, API, UI, Main Logic).
* **Performance-First:** Automatic resolution switching (lazy loading `50m` vs `110m` GeoJSON based on zoom level).
* **Persistent State:** Saves user selection, view position (POV), and theme preferences to `localStorage`.
* **Reactive UI:** Uses a Proxy-based state manager to keep the UI and Globe in sync automatically.

## Project Structure
```text
/project-root
│   index.html              <-- Entry point
├── /css
│     style.css             <-- Styling and responsive layout
├── /js
│     main.js               <-- Main orchestrator and initialization
│     api.js                <-- Data fetching and GeoJSON handling
│     state.js              <-- Proxy-based state manager
│     ui.js                 <-- Event listeners and DOM helpers
└── /assets
      earth-blue-marble.jpg <-- Local globe texture
      50m.json              <-- High-resolution GeoJSON
      110m.json             <-- Low-resolution GeoJSON
```

## Getting Started

### Running Locally
1.  **Using VS Code:** Install the **"Live Server"** extension. Right-click `index.html` and select "Open with Live Server".
2.  **Using Node.js:** If you have Node installed, run the following in your terminal:
    ```bash
    npx serve .
    ```
    Then, navigate to `http://localhost:3000` in your browser.

Note that you cannot open `index.html` directly in your browser because this project uses ES Modules for clean separation of concerns, but otherwise it uses vanilla JavaScript meaning there are no build steps or complex bundlers required.

## Tech Stack
* **[Globe.gl](https://github.com/vasturiano/globe.gl):** The core 3D globe library.
* **[Three.js](https://github.com/mrdoob/three.js):** The underlying rendering engine.

## Customization
* **Adding Data:** Place new [GeoJSON](https://github.com/nvkelso/natural-earth-vector/tree/master/geojson) files in the `/assets` folder and update the filenames in `js/api.js`.
* **Theming:** Modify CSS variables in `css/style.css` to change the UI color palette.
* **Globe Texture:** Swap [earth-blue-marble.jpg](https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg) with any equirectangular projection image in the `/assets` folder.
