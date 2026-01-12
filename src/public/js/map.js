document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  const token = document.body.dataset.mapboxToken;
  if (!token) {
    console.error("❌ Mapbox token missing");
    return;
  }

  const rawCoords = mapDiv.dataset.coordinates;
  if (!rawCoords) {
    console.error("❌ Coordinates missing on map div");
    return;
  }

  let coordinates;
  try {
    coordinates = JSON.parse(rawCoords);
  } catch {
    console.error("❌ Coordinates JSON invalid:", rawCoords);
    return;
  }

  // Ensure coordinates are valid [lng, lat]
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    console.error("❌ Invalid coordinates format:", coordinates);
    return;
  }

  mapboxgl.accessToken = token;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,
    zoom: 9,
  });

  // Add marker at listing coordinates
  new mapboxgl.Marker({ color: "red" }).setLngLat(coordinates).addTo(map);
});
