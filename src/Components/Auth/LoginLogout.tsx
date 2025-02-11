import { useAuth } from "react-oidc-context";

const LoginLogoutButton = () => {
  const { signinRedirect, signoutRedirect, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <button
        className="text-secondary hover:text-tertiary"
        onClick={async () => {
          await signoutRedirect();
        }}
      >
        Log Out
      </button>
    );
  } else {
    return (
      <button
        className="text-secondary hover:text-tertiary"
        onClick={() => {
          signinRedirect();
        }}
      >
        Log In
      </button>
    );
  }
};

export default LoginLogoutButton;
