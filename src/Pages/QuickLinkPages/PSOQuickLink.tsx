import { Link } from "react-router-dom";
import PSOBanner from "../../Pictures/PSOBanner.webp"

const PSOQuickLink = () => {
  return (
    <>
      <div className="flex flex-col items-center w-full">
        {/* Image Section */}
        <div className="w-full h-60 overflow-hidden mb-10">
          <img
            className="w-full h-full object-cover object-center shadow-lg"
            src={PSOBanner}
            alt="PSO Image"
          />
        </div>{" "}
        <h4 className="text-3xl font-bold text-gray-800 mb-4">
          PUBLIC SAFETY OFFICER
        </h4>
        <hr className="w-1/2 mb-6 border-t-2 border-gray-300" />
        <Link
          className="text-2xl text-blue-500 font-semibold hover:text-blue-900 hover:scale-105 p-2 transition duration-300"
          to="/shift/view/claimed"
        >
          My Shifts
        </Link>
        <Link
          className="text-2xl text-blue-500 font-semibold hover:text-blue-900 hover:scale-105 p-2 transition duration-300"
          to="/shift/view/available"
        >
          Available Shifts
        </Link>
        <Link
          className="text-2xl text-blue-500 font-semibold hover:text-blue-900 hover:scale-105 p-2 transition duration-300"
          to="/project/view"
        >
          Projects
        </Link>
      </div>
    </>
  );
};

export default PSOQuickLink;
