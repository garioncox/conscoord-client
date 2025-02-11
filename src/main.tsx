import { StrictMode } from "react";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import { AuthProvider, AuthProviderProps } from "react-oidc-context";
import "../scss/default.scss";
import MainLayout from "./Components/Layout/MainLayout.tsx";
import { ErrorBoundary } from "react-error-boundary";
import Error from "./Components/Error.tsx";

const oidcConfig: AuthProviderProps = {
  authority: "https://dev-zas6rizyxopiwv2b.us.auth0.com/",
  client_id: "BOZHiKTbFJOrquI2E4QMI2qARqMW9OgC",
  redirect_uri:
    process.env.NODE_ENV === "production"
      ? "https://conscoord.duckdns.org/"
      : "http://localhost:5173/",
  scope: "openid profile email",
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
  post_logout_redirect_uri:
    process.env.NODE_ENV === "production"
      ? "https://conscoord.duckdns.org/"
      : "http://localhost:5173/",
  automaticSilentRenew: true,
};

ReactDOM.render(
  <BrowserRouter>
    <StrictMode>
      <AuthProvider {...oidcConfig}>
        <MainLayout>
          <ErrorBoundary fallback={<Error />}>
            <App />
          </ErrorBoundary>
        </MainLayout>
      </AuthProvider>
    </StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);
