import React from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const AdminNavbar = ({ bgColor }) => {

  const { admin, logout } = useAdmin()

  return (
    <div className={`flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 ${bgColor}`}>
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {admin?.username} (Admin)</p>
        <button 
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;