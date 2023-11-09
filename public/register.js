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

        const data = await response.json();
        if (response.status !== 201) return alert(data.message);

        alert(data.message);
        // save the token in the local storage
        localStorage.setItem('token', data.token);
        // redirect user
        window.location.replace(data.redirect);
    } catch (e) {
        alert(`Error: ${e}`);
    }
});
