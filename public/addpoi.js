document.getElementById('ADD POI').addEventListener('click', async () => {
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
        const response = await fetch('/pois/addPoi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(poi),
        });

        if (response.status == 201) {
            alert('Successfully added');
            const pos = [lat, lon];
            const marker = L.marker(pos).addTo(map);
            marker
                .bindPopup(`<b>${poi.name}</b><br>${poi.description}`)
                .openPopup();
        } else if (response.status == 400) {
            alert('Blank fields');
        } else {
            alert(`Unknown error: code ${response.status}`);
        }
    } catch (e) {
        alert(`Error: ${e}`);
    }
});
