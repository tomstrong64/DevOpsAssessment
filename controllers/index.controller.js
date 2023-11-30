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
import i18n from '../i18n.js';

export const home = (req, res) => {
    if (!req.cookies.i18n) {
        res.cookie('i18n', 'en');}
    i18n.setLocale(req.cookies.i18n);
    return res.render('index', {
        i18n: res,
    });
};
export const addpoi = (req, res) => {
    return res.render('addpoi', {
        i18n: res,
    });
};
export const allpois = (req, res) => {
    return res.render('allpois', {
        i18n: res,
    });
};
export const allusers = (req, res) => {
    return res.render('allusers', {
        i18n: res,
    });
};
export const updatepoi = (req, res) => {
    return res.render('updatepoi', {
        i18n: res,
    });
};
export const updateuser = (req, res) => {
    return res.render('updateuser', {
        i18n: res,
    });
};
export const register = (req, res) => {
    return res.render('register', {
        i18n: res,
    });
};
export const login = (req, res) => {
    return res.render('login', {
        i18n: res,
    });
};
export const privacypolicy = (req, res) => {
    return res.render('privacypolicy', {
        i18n: res,
    });
};
