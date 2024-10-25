import React, { useState } from "react";
import { Link } from "react-router-dom"; 

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

 

  const userEmail=localStorage.getItem("email")

  // Logout function to clear localStorage and redirect to login
  const onLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href="/"
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* Profile Section */}
        <div className="relative">
          {/* Hoverable Profile */}
          <div
            className="cursor-pointer p-2 rounded-lg hover:bg-blue-100 transition duration-200 flex items-center"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className="font-bold"><i className="fa-solid fa-user"></i></span>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-[40px] mt-2 w-48 bg-white shadow-lg z-10">
              {/* Individual boxes for each detail */}
              
              <div>
                <div className="p-2 text-center border rounded-md mb-1">
                  {userEmail}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <ul className="flex space-x-4 text-gray-600">
            <li>
            
              <Link to="/history" className="hover:text-blue-600 transition duration-200">
                History
              </Link>
            </li>
          </ul>

          
          <button
            onClick={onLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
