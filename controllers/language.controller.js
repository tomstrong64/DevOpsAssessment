export const en = (req, res) => {
    res.cookie('i18n', 'en');
    res.redirect('/');
};
export const pt = (req, res) => {
    res.cookie('i18n', 'pt');
    res.redirect('/');
};
export const es = (req, res) => {
    res.cookie('i18n', 'es');
    res.redirect('/');
};
export const fr = (req, res) => {
    res.cookie('i18n', 'fr');
    res.redirect('/');
};
export const tr = (req, res) => {
    res.cookie('i18n', 'tr');
    res.redirect('/');
};
