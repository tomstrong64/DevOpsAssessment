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
export const home = (req, res) => {
    res.render('index');
};
export const addpoi = (req, res) => {
    res.render('addpoi');
};
export const allpois = (req, res) => {
    res.render('allpois');
};
export const allusers = (req, res) => {
    res.render('allusers');
};
export const updatepoi = (req, res) => {
    res.render('updatepoi');
};
export const updateuser = (req, res) => {
    res.render('updateuser');
};
export const register = (req, res) => {
    res.render('register');
};
export const login = (req, res) => {
    res.render('login');
};
export const privacypolicy = (req, res) => {
    res.render('privacypolicy');
};
export const devdocs = (req, res) => {
    res.render('dev-docs');
};
