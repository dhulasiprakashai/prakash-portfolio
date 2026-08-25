import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function PageContainer({ children, className = "", id }: PageContainerProps) {
  return (
    <div
      id={id}
      className={`container ${className}`}
      style={{
        paddingLeft: "20px",
        paddingRight: "20px",
      }}
    >
      {children}
    </div>
  );
}
