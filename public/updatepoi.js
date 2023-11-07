document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const poiId = urlParams.get('id');

    try {
        const response = await fetch(`/pois/list?id=${poiId}`);
        const poi = await response.json();
        console.log(poi._name);
        if (response.status !== 200) {
            throw new Error(poi.message || 'Failed to fetch POI details');
        }

        // Pre-populate the form fields
        document.getElementById('poiId').value = poi._id;
        document.getElementById('name').value = poi.name;
        document.getElementById('type').value = poi.type;
        document.getElementById('country').value = poi.country;
        document.getElementById('region').value = poi.region;
        document.getElementById('lat').value = poi.lat;
        document.getElementById('lon').value = poi.lon;
        document.getElementById('description').value = poi.description;
    } catch (error) {
        console.error(error);
        alert('Failed to fetch POI details');
    }
});

document.getElementById('UPDATE POI').addEventListener('click', async (e) => {
    e.preventDefault();
    const poi = {
        // Get the values from the form fields
        _id: document.getElementById('poiId').value,
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        country: document.getElementById('country').value,
        region: document.getElementById('region').value,
        lat: document.getElementById('lat').value,
        lon: document.getElementById('lon').value,
        description: document.getElementById('description').value,
    };
    console.log(poi._id);
    console.log(poi._name);

    try {
        const response = await fetch(
            `/pois/updatePoi?id=${poi._id}`,

            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(poi),
            }
        );

        if (response.status === 200) {
            alert('POI updated successfully');
        } else {
            alert(`Failed to update POI: ${response.statusText}`);
        }
    } catch (error) {
        console.error(error);
        alert('Failed to update POI');
    }
});
