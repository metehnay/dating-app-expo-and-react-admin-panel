import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseUser,
  faUserPlus,
  faDatabase,
  faEnvelope,
  faChartLine,
  faUsers,
  faComments,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
  { icon: faHouseUser, label: "Home", to: "/" },
  { icon: faChartLine, label: "Stats", to: "/stats" },
  { icon: faUserPlus, label: "Create User", to: "/createuser" },
  { icon: faEnvelope, label: "Send Notification", to: "/sendmessage" },
  { icon: faDatabase, label: "Manage Data", to: "/managedata" },
  { icon: faUsers, label: "User List", to: "/userlist" },
  { icon: faKey, label: "Update Token", to: "/tokenupdate" },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-80 h-screen p-6 bg-gray-900 text-gray-100 shadow-lg">
      <div className="mb-10 flex items-center space-x-3">
        <div className="bg-gray-100 text-gray-900 rounded-full p-3">
          <span className="text-2xl font-bold">AP</span>{" "}
        </div>
        <h1 className="text-2xl font-bold border-b border-gray-700 pb-2">
          Admin
        </h1>
      </div>

      <div className="flex flex-col space-y-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg p-4 flex items-center space-x-4 transition-transform transform hover:scale-105"
          >
            <span className="text-xl">
              <FontAwesomeIcon icon={item.icon} />
            </span>
            <span className="text-lg font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
