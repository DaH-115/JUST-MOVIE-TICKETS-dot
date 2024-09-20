import { useState, useEffect } from "react";

const ScrollToTopButton = () => {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 200) {
        setShowScrollTopButton(true);
      } else {
        setShowScrollTopButton(false);
      }
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTopHandler}
      className={`fixed bottom-5 right-5 z-50 flex h-16 w-16 transform items-center justify-center rounded-full bg-gray-800 p-4 font-bold text-white shadow-lg transition-all duration-300 hover:bg-gray-950 ${
        showScrollTopButton
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
    >
      Top
    </button>
  );
};

export default ScrollToTopButton;
