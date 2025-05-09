import { NavLink, Outlet } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";

export default function BasicLayout() {
  return (
    <div className="bg-[#2D4739] text-white min-h-screen">
      <header className="relative">
        {/* Home icoon rechtsboven */}
        <NavLink to="/" className="absolute top-6 right-8">
          <IoHomeSharp className="h-8 w-8 sm:h-12 sm:w-12 lg:h-20 lg:w-20" />
        </NavLink>

        {/* Navigatie */}
        <nav className="flex flex-col items-center gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo + Titel wrapper */}
          <div className="flex flex-col items-center gap-2 lg:flex-row lg:items-center lg:flex-1">
            {/* Logo */}
            <img
              className="h-16 w-16 sm:h-24 sm:w-24 lg:h-32 lg:w-32 object-contain"
              src="/fbloonwerk.png"
              alt="Logo"
            />

            {/* Titel */}
            <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl text-center lg:text-left lg:ml-6 break-words">
              Timesheet Registration
            </h1>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
