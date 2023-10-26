async function healthcheck() {
    const response = await fetch('http://localhost:3000/healthcheck');
    const { status } = await response.json();

    if (status !== 'OK') {
        console.log(response.status, status);
        process.exit(1);
    }

    process.exit(0);
}

await healthcheck();
