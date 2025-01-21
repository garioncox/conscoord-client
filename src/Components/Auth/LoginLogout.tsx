import { useAuth } from "react-oidc-context";

const LoginLogoutButton = () => {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <button onClick={() => void auth.removeUser()}>Log Out</button>
  }

  else {
    return <button onClick={() => {
      auth.signinRedirect();
    }}>Log In</button>
  }
}

export default LoginLogoutButton;
