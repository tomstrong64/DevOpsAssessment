/*
 * Copyright [2023] [Coordinated Chaos]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Login();
// Login
async function Login() {
    document.getElementById('login').addEventListener('click', async (e) => {
        e.preventDefault();

        const user = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
        };

        if (!user.email) return alert('Please enter your email');
        if (!user.password) return alert('Please enter your password');

        try {
            const response = await fetch('/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            await responseHandler(response);
        } catch (error) {
            return alert(`Error: ${error}`);
        }
    });
}
