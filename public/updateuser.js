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

        // Pre-populate the form fields

        document.getElementById('username').value = data.name;
        document.getElementById('email').value = data.email;
    } catch (error) {
        console.error(error);
        alert('Failed to fetch User details');
    }
});

document.getElementById('UPDATE USER').addEventListener('click', async (e) => {
    e.preventDefault();

    // Get the values from the form fields

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const newpassword = document.getElementById('NewPassword').value;
    const confirmpassword = document.getElementById('ConfirmNewPassword').value;
    const password = document.getElementById('Password').value;

    // Check if new password and confirm password match
    if (newpassword !== confirmpassword) {
        alert('New password and confirm password do not match');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/user/updateUser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                email: email,
                newpassword: newpassword,
                confirmpassword: confirmpassword,
                password: password, // Send the current password for verification
            }),
        });

        await responseHandler(response);
    } catch (error) {
        console.error(error);
        alert('Failed to update User');
    }
});
document.getElementById('LOGOUT USER').addEventListener('click', async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/user/logout', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await responseHandler(response);
        localStorage.removeItem('token');
    } catch (error) {
        console.error(error);
        alert('Failed to logout User');
    }
});
document.getElementById('DELETE USER').addEventListener('click', async (e) => {
    e.preventDefault();

    const password = document.getElementById('Password').value;

    try {
        if (!password) {
            alert('Password cannot be blank');
            return;
        }
        const isConfirmed = confirm(
            'Are you sure you want to delete your account?'
        );
        if (!isConfirmed) {
            // If the user cancels the confirmation, do nothing
            return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch('/user/deleteUser', {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        await responseHandler(response);
        localStorage.removeItem('token');
    } catch (e) {
        alert('Failed to delete User');
    }
});
