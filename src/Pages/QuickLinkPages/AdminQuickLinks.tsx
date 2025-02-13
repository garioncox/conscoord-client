import { Link } from "react-router-dom";
import AdminBanner from "../../Pictures/AdminBanner.jpg";

const AdminQuickLinks = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        {/* Image Section */}
        <div className="w-full h-60 overflow-hidden mb-10">
          <img
            className="w-full h-full object-cover object-center shadow-lg"
            src={AdminBanner}
            alt="Admin Image"
          />
        </div>{" "}
        <h4 className="text-3xl font-bold text-gray-800 mb-4">ADMIN</h4>
        <hr className="w-1/2 mb-6 border-t-2 border-gray-300" />
        <Link
          className="text-2xl text-blue-500 font-semibold hover:text-blue-900 hover:scale-105 p-2 transition duration-300"
          to="/admin/user/view"
        >
          Employees
        </Link>
        <Link
          className="text-2xl text-blue-500 font-semibold hover:text-blue-900 hover:scale-105 p-2 transition duration-300"
          to="/project/view"
        >
          Projects
        </Link>
        <Link
          className="text-2xl text-blue-500 font-semibold hover:text-blue-900 hover:scale-105 p-2 transition duration-300"
          to="/shift/view/available"
        >
          Available Shifts
        </Link>
      </div>
    </>
  );
};

export default AdminQuickLinks;
