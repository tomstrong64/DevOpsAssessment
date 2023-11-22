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

document.getElementById('ADD POI').addEventListener('click', async (e) => {
    e.preventDefault();
    const poi = {
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
        const response = await fetch('/pois/addPoi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(poi),
        });

        await responseHandler(response);
    } catch (e) {
        alert(`Error: ${e}`);
    }
});
