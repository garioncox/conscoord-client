import { createContext, useContext } from "react";
import { User } from "@auth0/auth0-react";

export interface IUserContext {
  currentUser: User | undefined;
}

export const authContext = createContext<IUserContext>({
  currentUser: undefined,
});

export const useAuthContext = () => {
  return useContext(authContext);
};
