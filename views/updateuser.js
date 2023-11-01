document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    try {
        const response = await fetch(`/user/list?id=${userId}`);
        const user = await response.json();
        if (response.status !== 200) {
            throw new Error(poi.message || 'Failed to fetch User details');
        }

        // Pre-populate the form fields
        document.getElementById('userId').value = user._id
        document.getElementById('username').value = user.name;
        document.getElementById('email').value = user.email;
       

    } catch (error) {
        console.error(error);
        alert('Failed to fetch User details');
    }
    
});

document.getElementById('UPDATE USER').addEventListener('click', async (e) => {
    e.preventDefault();
    const user = {
        // Get the values from the form fields
        "_id": document.getElementById('userId').value,
        "userame": document.getElementById('username').value,
        "email": document.getElementById('email').value,
        "password": document.getElementById('password').value,
        
    };
    try {
        const response = await fetch(`/user/updateUser?id=${user._id}`, 
       
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.status === 200) {
            alert('User updated successfully');
        } else {
            alert(`Failed to update User: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        alert('Failed to update User');
    }
});
