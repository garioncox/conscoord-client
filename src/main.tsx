import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import "../scss/default.scss";
import MainLayout from "./Components/Layout/MainLayout.tsx";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./Components/Error.tsx";

ReactDOM.render(
  <BrowserRouter>
    <StrictMode>
      <Auth0Provider
        domain="dev-zas6rizyxopiwv2b.us.auth0.com"
        clientId="BOZHiKTbFJOrquI2E4QMI2qARqMW9OgC"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
        cacheLocation="localstorage"
      >
        <MainLayout>
          <ErrorBoundary fallback={<Error />}>
            <App />
          </ErrorBoundary>
        </MainLayout>
      </Auth0Provider>
    </StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);
