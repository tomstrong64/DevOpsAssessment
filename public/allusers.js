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
        const response = await fetch(`/user/deleteUser/${id}`, {
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
