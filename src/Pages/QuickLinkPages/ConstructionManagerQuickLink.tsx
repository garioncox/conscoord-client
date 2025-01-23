import { Link } from "react-router-dom";

export const ConstructionManagerQuickLink = () => {
  return (
    <>
      <div className="flex flex-col items-center w-screen">
        {/* Image Section */}
        <div className="w-11/12 h-60 overflow-hidden mb-10">
          <img
            className="w-full h-full object-cover object-center shadow-lg"
            src="https://construction-today.com/wp-content/uploads/sites/5/2024/01/AdobeStock_95426986-800x445.jpeg"
            alt="Construction Image"
          />
        </div>
        
        <h4 className="text-3xl font-bold text-gray-800 mb-4">
          CONSTRUCTION MANAGER
        </h4>
        <hr className="w-1/2 mb-6 border-t-2 border-gray-300" />
        
        {/* Links */}
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
