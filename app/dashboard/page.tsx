"use client";

import { useEffect, useState } from "react";
import DesktopPage from "./desktop-page";
import MobilePage from "./mobile-page";

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Run once on load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobilePage /> : <DesktopPage />;
}
