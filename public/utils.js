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
async function responseHandler(response, noredirect = false) {
    const data = await response.json();
    alert(data.message);
    if (response.status !== 200 && response.status !== 201) return false;
    if (data.token) localStorage.setItem('token', data.token);
    if (data.redirect && !noredirect) window.location.replace(data.redirect);
    return data;
}
