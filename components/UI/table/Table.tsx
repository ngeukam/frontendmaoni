import React from "react";

type TableProps = {
  children: React.ReactNode;
};

type TableCellProps = {
  children: React.ReactNode;
  width?: string; // Permet de définir la largeur en pourcentage, px, rem, etc.
  className?: string;
};

const Table: React.FC<TableProps> = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full border border-gray-300 dark:border-gray-600">{children}</table>
  </div>
);

const TableHeader: React.FC<TableProps> = ({ children }) => (
  <thead className="bg-gray-200 dark:bg-gray-700">{children}</thead>
);

const TableBody: React.FC<TableProps> = ({ children }) => <tbody>{children}</tbody>;

const TableRow: React.FC<TableProps> = ({ children }) => (
  <tr className="border-b border-gray-300 dark:border-gray-600">{children}</tr>
);

const TableCell: React.FC<TableCellProps> = ({ children, width, className }) => (
  <td
    className={`px-4 py-2 text-center border-r border-gray-300 dark:border-gray-600 ${className}`}
    style={{ width }} // Applique la largeur dynamique
  >
    {children}
  </td>
);

export { Table, TableHeader, TableBody, TableRow, TableCell };
