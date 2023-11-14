document.getElementById('ADD POI').addEventListener('click', async (e) => {
    e.preventDefault();
    const poi = {
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        country: document.getElementById('country').value,
        region: document.getElementById('region').value,
        lat: document.getElementById('lat').value,
        lon: document.getElementById('lon').value,
        description: document.getElementById('description').value,
    };

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/pois/addPoi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(poi),
        });

        await responseHandler(response);
    } catch (e) {
        alert(`Error: ${e}`);
    }
});
