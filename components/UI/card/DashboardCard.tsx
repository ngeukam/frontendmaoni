import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const DashboardCard: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({ children, className }) => (
  <div className={`p-2 ${className}`}>{children}</div>
);
