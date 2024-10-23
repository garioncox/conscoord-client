import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="">
        <img className="rounded-circle" src={user?.picture} alt={user?.name} />
        <h2>{user?.name}</h2>
        <p className="d-none d-md-inline">{user?.email}</p>
      </div>
    )
  );
};

export default Profile;
