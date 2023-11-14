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

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/user/deleteUser', {
            headers: {
                method: 'DELETE',
                Authorization: `Bearer ${token}`,
            },
        });
        await responseHandler(response);
        localStorage.removeItem('token');
    } catch (e) {
        alert('Failed to delete User');
    }
});
