import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { AppProvider } from "@shopify/polaris";
import enTranslations from '@shopify/polaris/locales/en.json';
import "@shopify/polaris/dist/styles.css";
ReactDOM.render(
  <React.StrictMode>
    <AppProvider i18n={enTranslations}>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
