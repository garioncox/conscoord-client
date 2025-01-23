import { useAuth } from "react-oidc-context";

const LoginLogoutButton = () => {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <button className="text-secondary hover:text-tertiary" onClick={() => void auth.removeUser()}>Log Out</button>
  }

  else {
    return <button className="text-secondary hover:text-tertiary" onClick={() => {
      auth.signinRedirect();
    }}>Log In</button>
  }
}

export default LoginLogoutButton;
