import axiosInstance from "@/api/axiosInstance";
import type { ICustomer, IItem, ISale, LoginData, LoginResponse, SignupResponse } from "@/utils/interfaces";

export const userLoginService = async (data: LoginData): Promise<LoginResponse> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data
}
export const userSignupService = async (data: LoginData): Promise<SignupResponse> => {
    const response = await axiosInstance.post("/user/register", data);
    return response.data
}

// CUSTOMER SERVICES
export const addCustomer = async (data: Omit<ICustomer, "_id">) => {
    const response = await axiosInstance.post("/customer", data);
    return response.data;
}

export const editCustomer = async (id: string, data: Partial<ICustomer>) => {
    const response = await axiosInstance.patch(`/customer/${id}`, data);
    return response.data;
}

export const deleteCustomer = async (id: string) => {
    const response = await axiosInstance.delete(`/customer/${id}`);
    return response.data;
}

export const fetchAllCustomer = async () => {
    const response = await axiosInstance.get("/customer/all");
    return response.data;
}

export const fetchCustomer = async (
    options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        limit?: number; skip?: number; sort?: any
    }
) => {
    const response = await axiosInstance.get("/customer", {
        params: options,
    });
    return response.data
}

//ITEMS SERVICES
export const addItem = async (data: Omit<IItem, "_id">) => {
    const response = await axiosInstance.post("/item", data);
    return response.data;
}

export const editItem = async (id: string, data: Partial<IItem>) => {
    const response = await axiosInstance.patch(`/item/${id}`, data);
    return response.data;
}

export const deleteItem = async (id: string) => {
    const response = await axiosInstance.delete(`/item/${id}`);
    return response.data;
}

export const fetchAllItem = async () => {
    const response = await axiosInstance.get("/item/all");
    return response.data;
}

export const fetchItems = async (
    options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        limit?: number; skip?: number; sort?: any
    }
) => {
    const response = await axiosInstance.get("/item", {
        params: options,
    });
    return response.data
}

// SALE SERVICES

export const addSale = async (data: Omit<ISale, "_id">) => {
    const response = await axiosInstance.post("/sale", data);
    return response.data;
}

export const deleteSale = async (id: string) => {
    const response = await axiosInstance.delete(`/sale/${id}`);
    return response.data;
}

export const fetchAllSale = async () => {
    const response = await axiosInstance.get("/sale/all");
    return response.data;
}

export const fetchSale = async (
    options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        limit?: number; skip?: number; sort?: any
    }
) => {
    const response = await axiosInstance.get("/sale", {
        params: options,
    });
    return response.data
}

export const fetchCustomerLedger = async (customerName: string) => {
    const response = await axiosInstance.get(`/sale/ledger/${customerName}`);
    return response.data
};

export const fetchSalesByDateRange = async (from: string, to: string) => {
    const response = await axiosInstance.get(`/sale/dateRange?from=${from}&to=${to}`);
    return response.data;
};

export const fetchItemSalesAndStock = async () => {
    const response = await axiosInstance.get("/item/report");
    return response.data;
};

export const exportSalesToExcel = async (from: string, to: string, customer?: string) => {
    const response = await axiosInstance.get("/export/excel", {
        params: { from, to, customer },
        responseType: "blob", // important for downloading files
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales-report.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// Fetch and download PDF
export const exportSalesToPDF = async (from: string, to: string, customer?: string) => {
    const response = await axiosInstance.get("/export/pdf", {
        params: { from, to, customer },
        responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales-report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();
};

// Send report via Email
export const sendSalesReportByEmail = async (
    from: string,
    to: string,
    customer: string | null,
    email: string
) => {
    const response = await axiosInstance.post("/export/email", {
        from,
        to,
        customer,
        email,
    });
    return response.data;
};

// Get Printable HTML
export const getPrintableSalesReport = async (from: string, to: string, customer?: string) => {
    const response = await axiosInstance.get("/export/print", {
        params: { from, to, customer },
    });
    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(response.data);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
};