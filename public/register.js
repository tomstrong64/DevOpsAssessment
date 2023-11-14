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
        await responseHandler(response);
    } catch (e) {
        alert(`Error: ${e}`);
    }
});
