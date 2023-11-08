document.getElementById('register').addEventListener('click', async (e) => {
    e.preventDefault();

    const user = {
        name: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.status == 201) {
            alert('Successfully added');
        } else if (response.status == 400) {
            alert('Blank fields');
        } else {
            alert(`Unknown error: code ${response.status}`);
        }
    } catch (e) {
        alert(`Error: ${e}`);
    }
});
