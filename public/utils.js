async function responseHandler(response) {
    const data = await response.json();
    alert(data.message);
    if (response.status !== 200 && response.status !== 201) return false;
    if (data.token) localStorage.setItem('token', data.token);
    if (data.redirect)  window.location.replace(data.redirect);
    return true;
};
