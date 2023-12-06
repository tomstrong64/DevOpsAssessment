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
document.addEventListener('DOMContentLoaded', async (e) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/pois/list`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const pois = await response.json();
    if (pois.length == 0) {
        alert('No Pois Found');
        return;
    }
    const tbody = document.getElementById('TableBody');

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
        <td>${poi.user.name}</td> 
    `;
        tr.id = poi._id;
        tbody.appendChild(tr);
    });
});
