Login();
// Login
async function Login() {
    document.getElementById('login').addEventListener('click', async (e) => {
        e.preventDefault();
       
        const user = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
             };
        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.status === 401) {
                return alert('Incorrect Login')
            } else if (response.status !== 200) {
               return alert(`Unknown error: code ${response.status}`);
            } 
            // if user logged in
            // get the data
            const data = await response.json();
            // save the token in the local storage
            localStorage.setItem('token', data.token);
            //redirect
            window.location.replace(data.redirect);

          //  const token = localStorage.getItem('token')
           // await fetch('/', {
            //    headers: { 
            //        Authorization: `Bearer ${token}`
              //  }
           // })


        } catch (error) {
           return alert(`Error: ${error}`);
        }
        alert('Login Successful');
        return (window.location.href = '/index.html');
    });
}
