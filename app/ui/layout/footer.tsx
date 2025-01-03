"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const borderStyle =
    "border-b-2 border-transparent transition duration-300 hover:border-white";

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;

      if (windowHeight + scrollTop >= documentHeight - 10) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="footer"
      className="w-full bg-black px-8 pb-8 pt-12 text-white lg:py-12"
    >
      <div className="pb-8">JUST YOUR TICKETS.</div>
      <div className="flex justify-between space-x-2 text-xs lg:text-sm">
        <div className="w-full space-y-1 border-l-2 border-dotted border-gray-500 pl-4">
          <div className={`${borderStyle} ${"font-bold"}`}>Resume</div>
          <div className={borderStyle}>Github</div>
          <div className={borderStyle}>Email</div>
        </div>
        <div className="w-full border-l-2 border-dotted border-gray-500 pl-4">
          <ul className="space-y-1">
            <li className={borderStyle}>
              <Link href="/">Home</Link>
            </li>
            <li className={borderStyle}>
              <Link href="/search">Search</Link>
            </li>
            <li className={borderStyle}>
              <Link href="/ticket-list">Ticket List</Link>
            </li>
          </ul>
        </div>
        <div
          className={`hidden w-full border-l-2 border-dotted border-gray-500 pl-4 lg:block`}
        >
          <div
            className={`font-bold transition-transform duration-700 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            ⓒGWAK DA HYUN 2024
          </div>
        </div>
      </div>
      <div
        className={`mt-8 border-t border-white pt-4 text-xs font-bold transition-transform duration-500 lg:hidden ${
          isVisible ? "translate-y-0" : "translate-y-10"
        }`}
      >
        ⓒGWAK DA HYUN 2024
      </div>
    </div>
  );
}
