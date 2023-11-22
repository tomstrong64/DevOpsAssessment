/*
 * Copyright [2023] [Coordinated Chaos]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const poiId = urlParams.get('id');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/pois/${poiId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const poi = await response.json();

        if (response.status !== 200) {
            throw new Error(poi.message || 'Failed to fetch POI details');
        }

        // Pre-populate the form fields
        document.getElementById('poiId').value = poi._id;
        document.getElementById('name').value = poi.name;
        document.getElementById('type').value = poi.type;
        document.getElementById('country').value = poi.country;
        document.getElementById('region').value = poi.region;
        document.getElementById('lat').value = poi.lat;
        document.getElementById('lon').value = poi.lon;
        document.getElementById('description').value = poi.description;
    } catch (error) {
        console.error(error);
        alert('Failed to fetch POI details');
    }
});

document.getElementById('UPDATE POI').addEventListener('click', async (e) => {
    e.preventDefault();
    const poi = {
        // Get the values from the form fields
        _id: document.getElementById('poiId').value,
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        country: document.getElementById('country').value,
        region: document.getElementById('region').value,
        lat: document.getElementById('lat').value,
        lon: document.getElementById('lon').value,
        description: document.getElementById('description').value,
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(
            `/pois/updatePoi/${poi._id}`,

            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(poi),
            }
        );

        await responseHandler(response);
    } catch (error) {
        console.error(error);
        alert('Failed to update POI');
    }
});
