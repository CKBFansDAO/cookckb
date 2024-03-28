import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en_US from '../locales/en-US.json'
import zh_CN from '../locales/zh-CN.json'

i18n.use(initReactI18next).init({
    resources: {
        en_US,
        zh_CN,
    },
    fallbackLng: 'en_US',
    interpolation: {
        escapeValue: false,
    },
})

export const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('locale', lang)
}

export const currentLanguage = () => {
    let language = localStorage.getItem('locale') || window.navigator.language.toLowerCase() || 'en';
    if (!language || language.length === 0) {
        language = 'en_US';
    }

    if (language.indexOf("zh") !== -1) {
        language = "zh_CN";
    } else if (language.indexOf('en') !== -1) {
        language = "en_US";
    } else {
        language = "en_US";
    }

    return language;
}

export default i18n
