let userId;
document.addEventListener('DOMContentLoaded', function () {
    Logincheck();
});

const map = L.map('map1');

const attrib =
    'Map data copyright OpenStreetMap contributors, Open Database Licence';

const tileLayer = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: attrib }
).addTo(map);
map.setView([51.51, -0.1], 14);

map.on('click', async (e) => {
    const lat = `${e.latlng.lat}`;
    const lon = `${e.latlng.lng}`;
    const addpoi = document.getElementById('addpoi');
    addpoi.innerHTML = `
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
  <input type="button" value="go" id="sendPOI" />`;

    document.getElementById('sendPOI').addEventListener('click', async () => {
        const poi = {
            name: document.getElementById('new_name').value,
            type: document.getElementById('new_type').value,
            country: document.getElementById('new_country').value,
            region: document.getElementById('new_region').value,
            lat: lat,
            lon: lon,
            description: document.getElementById('new_des').value,
        };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/pois/addPoi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(poi),
            });

            await responseHandler(response);
            const pos = [lat, lon];
            const marker = L.marker(pos).addTo(map);
            marker
                .bindPopup(`<b>${poi.name}</b><br>${poi.description}`)
                .openPopup();
        } catch (e) {
            alert(`Error: ${e}`);
        }
    });
});

document.getElementById('poi_search').addEventListener('click', (e) => {
    e.preventDefault();
    const region = document.getElementById('poi_region').value;
    ajaxSearch(region);
});

async function ajaxSearch(region) {
    const token = localStorage.getItem('token');
    const ajaxResponse = await fetch(`/pois/list?search=${region}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    let pois = await ajaxResponse.json();
    if (pois.length == 0) {
        alert('No Pois Found');
        return;
    }
    const resultsDiv = document.getElementById('poi_results');
    resultsDiv.innerHTML = '';

    // Create table and table headings
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trHeadings = document.createElement('tr');
    trHeadings.innerHTML = `
      <th>Name</th>
      <th>Type</th>
      <th>Country</th>
      <th>Region</th>
      <th>Longitude</th>
      <th>Latitude</th>
      <th>Description</th>
      <th>Update</th>
      <th>Delete</th>
    `;
    thead.appendChild(trHeadings);
    table.appendChild(thead);

    // Add table rows
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    if (userId) {
        pois = pois.filter((poi) => {
            if (poi.user !== userId) return false;
            return true;
        });
    }
    pois.forEach((poi) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${poi.name}</td>
        <td>${poi.type}</td>
        <td>${poi.country}</td>
        <td>${poi.region}</td>
        <td>${poi.lon}</td>
        <td>${poi.lat}</td>
        <td>${poi.description}</td>
        <td>
          <a href="updatepoi.html?id=${poi._id}">Update</a>
        </td>
        <td>
          <button onclick="deletePoi('${poi._id}')">Delete</button>
        </td>
      `;
        tr.id = poi._id;
        tbody.appendChild(tr);

        const pos = [poi.lat, poi.lon];
        const marker = L.marker(pos).addTo(map);
        marker
            .bindPopup(`<b>${poi.name}</b><br>${poi.description}`)
            .openPopup();
    });

    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(table);
}

async function deletePoi(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pois/deletePoi/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await responseHandler(response);
        if (result) {
            document.getElementById(id).remove();
        }
    } catch (e) {
        alert(`Error with POI ID ${id}: ${e}`);
    }
}
async function Logincheck() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/user/getUser`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.status !== 200) {
            return alert(data.message);
        }
        if (data.admin === true) {
            const getUsersElement = document.getElementById('get_users');
            const getPoisElement = document.getElementById('get_pois');

            getUsersElement.hidden = false;
            getPoisElement.hidden = false;

            userId = data._id;
        }
    } catch (error) {
        console.error(error);
        alert('Failed to fetch User details');
    }
}
