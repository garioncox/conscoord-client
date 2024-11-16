import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className="text-primary flex grow flex-col items-center mt-auto mb-5 mx-5">
        <img
          className="rounded-full mb-3 border-4 border-slate-400 min-h-28 min-w-min-h-28"
          src={user?.picture}
          alt=""
        />
        <p className="text-xl">{user?.name}</p>
        <p className="d-none d-md-inline">{user?.email}</p>
      </div>
    )
  );
};

export default Profile;
