import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './assets/en.json';
import ar from './assets/ar.json';
import * as RNLocalize from 'react-native-localize';

const {languageTag, isRTL} = RNLocalize.getLocales()[0];
let tagLang = 'en';

if (languageTag.startsWith('ar')) {
  tagLang = 'ar';
}
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: tagLang,
  fallbackLng: 'en',
  resources: {
    en: en,
    ar: ar,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});
console.log(i18n.language);
console.log(`tag ${languageTag}`);

export default i18n;
