import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initLumos } from './utils/lumos';
import { changeLanguage, currentLanguage } from './utils/i18n';
import Layout from './components/layout/Layout';

import './assets/fontawesome/css/fontawesome.css';
import './assets/fontawesome/css/brands.css';
import './assets/fontawesome/css/solid.css';
import { BrowserRouter } from 'react-router-dom';
import { WalletProvider } from './walletmgr/WalletContext';



initLumos();

const initLanguage = () => {
  const lang = currentLanguage();
  changeLanguage(lang);
}

initLanguage();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <Layout />
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
