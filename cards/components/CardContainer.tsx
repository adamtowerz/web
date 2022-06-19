import React from "react";

type CardContainerProps = {
  children?: React.ReactNode;
};

export default function CardContainer({ children }: CardContainerProps) {
  const patternStyles = {
    backgroundColor: "#e5e5f7",
    opacity: 0.8,
    backgroundImage: "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
    backgroundSize: "10px 10px",
  };
  return (
    <div
      className="w-full h-full bg-white flex justify-center items-center"
      style={patternStyles}
    >
      {children}
    </div>
  );
}
