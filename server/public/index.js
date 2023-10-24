const map = L.map("map1");

const attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";

const tileLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { attribution: attrib }
).addTo(map);
map.setView([51.51, -0.1], 14);