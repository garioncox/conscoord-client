import { queryClient } from "@/Functions/Queries/QueryClient";
import { queryKeys } from "@/Functions/Queries/QueryKeyFactory";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const LoginLogoutButton = () => {
  const { signinRedirect, removeUser, signoutSilent, isAuthenticated } =
    useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <button
        className="text-secondary hover:text-tertiary"
        onClick={async () => {
          await signoutSilent();
          await removeUser();

          await queryClient.resetQueries({
            queryKey: queryKeys.loggedInEmployee,
          });
          await queryClient.resetQueries({ queryKey: ["role"] });

          navigate("/");
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
