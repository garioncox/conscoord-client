import LandingPageBanner from "../../Pictures/LandingPageBanner.jpg";

const LandingPage = () => {
  return (
    <div className="flex flex-col w-screen">
      <div className="w-full h-60 overflow-hidden mb-10">
        <img
          className="w-full h-full object-cover object-center shadow-lg"
          src={LandingPageBanner}
          alt="Admin Image"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Traffic Control Shifts for Officers
        </h2>
        <p className="text-xl text-gray-600 mb-6">
          Sign up to work construction traffic control shifts during your time
          off. Help keep our streets safe while earning extra income.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
