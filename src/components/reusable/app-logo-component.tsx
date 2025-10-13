"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const AppLogoComponent = (props: React.SVGProps<SVGSVGElement>) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Ensure the component is only rendered after mounting on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a fallback fill value until the component is mounted
  const fillColor = mounted
    ? theme === "dark"
      ? "white"
      : "black"
    : "transparent";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="512"
      height="512"
      x="0"
      y="0"
      viewBox="0 0 64 64"
      fill={fillColor}
      {...props}
    >
      <g>
        <path
          fillRule="evenodd"
          d="M2 14C2 7.373 7.373 2 14 2h36c6.627 0 12 5.373 12 12v28c0 6.627-5.373 12-12 12H39.908l-6.403 7.317a2 2 0 0 1-3.01 0L24.093 54H14C7.373 54 2 48.627 2 42zm30 0a2 2 0 0 1 1.95 1.556l1.107 4.867a6 6 0 0 0 4.52 4.52l4.867 1.107a2 2 0 0 1 0 3.9l-4.867 1.107a6 6 0 0 0-4.52 4.52l-1.107 4.866a2 2 0 0 1-3.9 0l-1.107-4.866a6 6 0 0 0-4.52-4.52l-4.866-1.107a2 2 0 0 1 0-3.9l4.866-1.107a6 6 0 0 0 4.52-4.52l1.107-4.866A2 2 0 0 1 32 14z"
          clipRule="evenodd"
          opacity="1"
          data-original="#000000"
        ></path>
      </g>
    </svg>
  );
};

export default AppLogoComponent;
