import React from "react";
import { Link } from "react-router-dom";
function PageNotFound() {
  return (
    <>
      <main class="h-screen w-full flex flex-col justify-center items-center bg-gray-200">
        <h1 class="text-9xl font-extrabold text-white tracking-widest">404</h1>
        <div class="bg-[#5d8fdb] px-2 text-sm rounded rotate-12 absolute">
          Page Not Found
        </div>
        <button class="mt-5">
          <a
            class="relative inline-block text-sm font-medium text-[#fff] group active:text-blue-400 focus:outline-none focus:ring"
            href="/"
          >
            <span class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#4e65e6] group-hover:translate-y-0 group-hover:translate-x-0"></span>

            <span class="relative block px-8 py-3 bg-[#1A2238] border border-current">
              <Link to="/">Go Home</Link>
            </span>
          </a>
        </button>
      </main>
    </>
  );
}

export default PageNotFound;
