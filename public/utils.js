async function responseHandler(response) {
    const data = await response.json();
    alert(data.message);
    if (response.status !== 200 && response.response !== 201) return;
    if (data.token) localStorage.setItem('token', data.token);
    if (data.redirect) window.location.replace(data.redirect);
};
