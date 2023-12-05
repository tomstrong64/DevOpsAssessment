import i18n from 'i18n';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

i18n.configure({
    locales: ['en', 'pt', 'es', 'fr', 'tr'],
    defaultLocale: 'en',
    directory: path.join(__dirname, 'locales'),
    cookie: 'i18n',
});

export default i18n;
