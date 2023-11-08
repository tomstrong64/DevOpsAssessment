document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    try {
        const response = await fetch(`/user/getUser?id=${userId}`);
        const user = await response.json();
        if (response.status !== 200) {
            throw new Error(user.message || 'Failed to fetch User details');
        }

        // Pre-populate the form fields
        document.getElementById('userId').value = user._id;
        document.getElementById('username').value = user.name;
        document.getElementById('email').value = user.email;
    } catch (error) {
        console.error(error);
        alert('Failed to fetch User details');
    }
});

document.getElementById('UPDATE USER').addEventListener('click', async (e) => {
    e.preventDefault();

    // Get the values from the form fields
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password2').value;
    const currentPassword = document.getElementById('Cpassword').value;

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
    }

    try {
        const response = await fetch(`/user/updateUser?id=${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: userId,
                username: username,
                email: email,
                password: newPassword,
                currentPassword: currentPassword, // Send the current password for verification
            }),
        });

        if (response.status === 200) {
            alert('User updated successfully');
        } else if (response.status === 401) {
            alert('Current password is incorrect');
        } else {
            alert(`Failed to update User: ${response.statusText}`);
        }
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
        const data = await response.json();
        if (response.status !== 200) {
            return alert(data.message);
        }
        localStorage.removeItem('token');
        window.location.replace(data.redirect);
    } catch (error) {
        console.error(error);
        alert('Failed to update User');
    }
});
