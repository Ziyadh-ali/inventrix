import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DatePicker } from "@/components/datepicker";
import { Button } from "@/components/ui/button";
import { fetchAllCustomer } from "@/services/services";
import { exportSalesToExcel, exportSalesToPDF, sendSalesReportByEmail, getPrintableSalesReport } from "@/services/services";
import type { ICustomer } from "@/utils/interfaces";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";

export const ExportPage = () => {
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        async function loadCustomers() {
            try {
                const res = await fetchAllCustomer();
                setCustomers(res.customers);
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch customers");
            }
        }
        loadCustomers();
    }, []);

    const handleExport = async (type: "excel" | "pdf" | "email" | "print") => {
        if (!fromDate || !toDate) return toast.error("Select date range");

        const from = fromDate.toISOString();
        const to = toDate.toISOString();
        const customer = selectedCustomer || undefined;

        try {
            if (type === "excel") {
                await exportSalesToExcel(from, to, customer);
            } else if (type === "pdf") {
                await exportSalesToPDF(from, to, customer);
            } else if (type === "email") {
                if (!email) return toast.error("Please enter an email");
                await sendSalesReportByEmail(from, to, customer || null, email);
                toast.success("Report emailed successfully!");
            } else if (type === "print") {
                await getPrintableSalesReport(from, to, customer);
            }
        } catch (error) {
            console.log(error)
            toast.error("Export failed");
        }
    };

    return (
        <DashboardLayout>
            <Card className="w-full">
                <div className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                        <DatePicker selected={fromDate} onChange={setFromDate} />
                        <DatePicker selected={toDate} onChange={setToDate} />
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            className="border rounded p-2"
                        >
                            <option value="">All Customers</option>
                            {customers.map((c) => (
                                <option key={c._id} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Recipient Email"
                            className="border rounded p-2"
                        />
                    </div>

                    {/* Export Buttons */}
                    <div className="flex gap-4 mt-4 flex-wrap">
                        <Button onClick={() => handleExport("excel")}>Export as Excel</Button>
                        <Button onClick={() => handleExport("pdf")}>Export as PDF</Button>
                        <Button onClick={() => handleExport("email")}>Send via Email</Button>
                        <Button onClick={() => handleExport("print")}>Print</Button>
                    </div>
                </div>
            </Card>
        </DashboardLayout>
    );
};
