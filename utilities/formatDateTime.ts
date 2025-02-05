import React from "react";

export const formatDateTime = (dateString:any) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        // timeZoneName: "short"
    });
};
