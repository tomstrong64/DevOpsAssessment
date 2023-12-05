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
    const response = await fetch(`/user/list`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const users = await response.json();
    if (users.length == 0) {
        alert('No Users Found');
        return;
    }
    const resultsDiv = document.getElementById('users_results');
    resultsDiv.innerHTML = '';

    // Create table and table headings
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trHeadings = document.createElement('tr');
    trHeadings.innerHTML = `
      <th>Name</th>
      <th>E-mail</th>
      <th>Admin</th>
    `;
    thead.appendChild(trHeadings);
    table.appendChild(thead);

    // Add table rows
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    users.forEach((user) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.admin}</td>
        <td>
        <button onclick="UpdateUserStatus('${user._id}')">Admin</button>
        </td>
        <td>
          <button onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `;
        tr.id = user._id;
        tbody.appendChild(tr);
    });

    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(table);
});
async function deleteUser(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/user/deleteUser?id=${id}`, {
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
        alert(`Error with USER ID ${id}: ${e}`);
    }
}
async function UpdateUserStatus(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/user/updateUser/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await responseHandler(response);
        if (result) {
        }
    } catch (e) {
        alert(`Error with USER ID ${id}: ${e}`);
    }
}
