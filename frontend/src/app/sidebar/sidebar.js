import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./sidebar.css";

const Sidebar = () => {
  // const statusVar = "admin";
  // localStorage.setItem("status", statusVar);

  let userStatus;
  if (typeof window !== "undefined") {
    userStatus = localStorage.getItem("status");
  }
  const listItemSx = {
    border: "1px solid rgb(92, 141, 215)",
    borderRadius: "5px",
    backgroundColor: "rgb(92, 141, 215)",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "whitesmoke",
      color: "rgb(92, 141, 215)",
    },
  };

  let AccountOwner = "Accounts";
  if (typeof window !== "undefined") {
    // Use localStorage here
    if (localStorage.getItem("username") == "support@quantfarming.com")
      AccountOwner = "Sawyer Accounts";
    else AccountOwner = "Accounts";
  }

  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  const [isWebOpen, setWebIsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const toggleWebSidebar = () => {
    setWebIsOpen(!isWebOpen);
  };
  const handleLogout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("isSawyerLoggedIn", "false");
    localStorage.setItem("owner", "");
    router.push("/login");
  };

  const handleSawyerBusinessAccounts = () => {
    localStorage.setItem("owner", "sawyer");
    router.push("/dashboard");
  };

  const handleResetPassword = () => {
    router.push("/resetPassword");
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 800); // Adjust the breakpoint as needed
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div class="flex flex-col items-center w-40 h-full overflow-hidden text-gray-400 bg-black  rounded">
      <a class="flex items-center w-full px-3 mt-3 justify-center" href="#">
        <svg
          class="w-8 h-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
        </svg>
        <span class="ml-2 text-sm font-bold"></span>
      </a>
      <div class="w-full px-2">
        <div class="flex flex-col items-center w-full mt-3 border-t border-gray-700">
          <div
            class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300"
            onClick={handleSawyerBusinessAccounts}
          >
            <Image
              src="./img/dashboardIcon.svg"
              alt="Bar Up Icon"
              class="w-10 h-10 mr-2"
              width="10"
              height="10"
            />
            <span class="text-sm font-medium">Dashboard</span>
          </div>

          <div
            class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300"
            onClick={handleResetPassword}
          >
            <Image
              src="./img/resetPasswordIcon.svg"
              alt="Bar Up Icon"
              class="w-10 h-10 mr-2"
              width="24"
              height="24"
            />
            <span class="text-sm font-medium">Reset Password</span>
          </div>
        </div>

        <div class="flex flex-col items-center w-full mt-2 border-t border-gray-700">
          <div
            class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-700 hover:text-gray-300"
            onClick={handleLogout}
          >
            <Image
              src="./img/logout.svg"
              alt="Bar Up Icon"
              class="w-10 h-10 mr-2"
              width="10"
              height="10"
            />
            <span class="text-sm font-medium">Logout</span>
          </div>
        </div>
      </div>
      <a
        class="flex items-center justify-center w-full h-16 mt-auto bg-black hover:bg-gray-700 hover:text-gray-300"
        href="#"
      >
        <svg
          class="w-6 h-6 stroke-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="ml-2 text-sm font-medium">Account</span>
      </a>
    </div>
  );
};

export default Sidebar;
