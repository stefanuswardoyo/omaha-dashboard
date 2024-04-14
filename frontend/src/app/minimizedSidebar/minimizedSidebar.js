import React from "react";
import Image from "next/image";

const MinimizedSidebar = () => {
  return (
    <div className="flex flex-col items-center w-16 h-full overflow-hidden text-gray-400 bg-black rounded">
      <a className="flex items-center justify-center mt-3" href="#">
        <svg
          className="w-8 h-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
      </a>
      <div className="flex flex-col items-center mt-3 border-t border-gray-700">
        <div className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300">
          <Image
            src="./img/dashboardIcon.svg"
            alt="Bar Up Icon"
            className="w-10 h-10 mr-2"
            width="10"
            height="10"
          />
        </div>
      </div>
      <div className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300">
        <Image
          src="./img/resetPasswordIcon.svg"
          alt="Bar Up Icon"
          className="w-10 h-10 mr-2"
          width="10"
          height="10"
        />
      </div>
      <div className="flex flex-col items-center mt-2 border-t border-gray-700">
        <div className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-700 hover:text-gray-300">
          <Image
            src="./img/logout.svg"
            alt="Bar Up Icon"
            className="w-10 h-10 mr-2"
            width="10"
            height="10"
          />
        </div>
      </div>
      <a
        className="flex items-center justify-center w-16 h-16 mt-auto bg-black hover:bg-gray-700 hover:text-gray-300"
        href="#"
      >
        <svg
          className="w-6 h-6 stroke-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </a>
    </div>
  );
};

export default MinimizedSidebar;
