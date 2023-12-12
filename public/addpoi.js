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

    const form = document.getElementById('addPoiForm');
    const formData = new FormData(form);

    if (!formData.get('name')) return alert('Please enter a name for the POI');
    if (!formData.get('type')) return alert('Please enter a type for the POI');
    if (!formData.get('country'))
        return alert('Please enter a country for the POI');
    if (!formData.get('region'))
        return alert('Please enter a region for the POI');
    if (!formData.get('lat'))
        return alert('Please enter a latitude for the POI');
    if (!formData.get('lon'))
        return alert('Please enter a longitude for the POI');
    if (!formData.get('description'))
        return alert('Please enter a description for the POI');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/pois/addPoi', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        await responseHandler(response);
    } catch (e) {
        alert(`Error: ${e}`);
    }
});
