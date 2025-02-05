import * as XLSX from "xlsx";
import capitalizeWords from "./capitalize";
import { IUserBusiness } from "../lib/types/user";
import * as FileSaver from 'file-saver';

export const downloadExcel = (company: IUserBusiness) => {
    const codesData = [
        ...(company.active_codes ?? []).map((code) => ({ Status: "Active", Code: code })),
        ...(company.inactive_codes ?? []).map((code) => ({ Status: "Inactive", Code: code })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(codesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Codes");

    const fileName = `${capitalizeWords(company.name)}-${capitalizeWords(company.city)}-${capitalizeWords(company.countrynamecode)}_codes.xlsx`;
    XLSX.writeFile(workbook, fileName);
};

export const MultidownloadExcel = (companies: IUserBusiness[]) => {
    const codesData = companies.flatMap((company) => 
        [
            ...(company.active_codes ?? []).map((code) => ({
                Business: capitalizeWords(company.name), // Business Name Column
                Status: "Active",
                Code: code,
            })),
            ...(company.inactive_codes ?? []).map((code) => ({
                Business: capitalizeWords(company.name), // Business Name Column
                Status: "Inactive",
                Code: code,
            })),
        ]
    );

    const worksheet = XLSX.utils.json_to_sheet(codesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Codes");

    // Format business names for the filename (handle multiple businesses)
    const formattedBusinessNames = companies
        .map((company) => capitalizeWords(company.name).replace(/[^a-zA-Z0-9]/g, "_"))
        .join("_and_"); // Join multiple business names with "_and_"

    // Use first city and country if businesses are from the same location
    const city = capitalizeWords(companies[0]?.city || "Unknown");
    const country = capitalizeWords(companies[0]?.countrynamecode || "Unknown");

    const fileName = `${formattedBusinessNames}-${city}-${country}_codes.xlsx`;
    XLSX.writeFile(workbook, fileName);
};

export const exportToExcel = (data: any[], fileName: string = 'data') => { // Make data type more flexible
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { 'Sheet1': ws }, SheetNames: ['Sheet1'] }; // Give a default sheet name
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: fileType }); // Use Blob directly

    FileSaver.saveAs(blob, fileName + fileExtension);
};

export const exportToJson = (data: any[], fileName: string = 'data') => { // Make data type more flexible
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' }); // Use Blob directly

    FileSaver.saveAs(blob, fileName + '.json');
};