const map = L.map("map1");

const attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";

const tileLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  { attribution: attrib }
).addTo(map);
map.setView([51.51, -0.1], 14);

map.on("click", async(e) => {
  
  const lat = `${e.latlng.lat}`
  const lon = `${e.latlng.lng}`
  const addpoi = document.getElementById("addpoi");
  addpoi.innerHTML= `
  <h2>Add a Point Of Interest</h2>
  <p>
  Name: <br />
  <input id="new_name" /><br />
  Type: <br />
  <input id="new_type" /><br />
  Country: <br />
  <input id="new_country" /><br />
  Region: <br />
  <input id="new_region" /><br />
  Description: <br />
  <input id="new_des" /><br />
  <input type="button" value="go" id="sendPOI" />`
  
  document.getElementById("sendPOI").addEventListener("click", async() => {

    const poi = {
      "name": document.getElementById("new_name").value,
      "type": document.getElementById("new_type").value,
      "country": document.getElementById("new_country").value,
      "region": document.getElementById("new_region").value,
      "lat": lat,
      "lon": lon,
      "description": document.getElementById("new_des").value
  };

  try {

      const response = await fetch('/pois/addPoi', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(poi)
      });    

      
      if(response.status == 201) {
          alert("Successfully added");
          const pos = [lat, lon]
          const marker = L.marker(pos).addTo(map);
      marker.bindPopup(`<b>${poi.name}</b><br>${poi.description}`).openPopup();
      } else if (response.status == 400) {
          alert("Blank fields");
      } else {
          alert(`Unknown error: code ${response.status}`);
      }
  } catch(e) {
      alert(`Error: ${e}`);
  }
});

});

