/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ReusableTable } from "@/components/Table";
import { fetchCustomerLedger, fetchAllCustomer } from "@/services/services";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ICustomer } from "@/utils/interfaces";

type LedgerEntry = {
  date: string;
  type: "Sale";
  amount: number;
};

export const CustomerLedger = () => {
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  // Fetch all customers on mount
  useEffect(() => {
    async function getCustomers() {
      try {
        const response = await fetchAllCustomer();
        setCustomers(response.customers);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    }
    getCustomers();
  }, []);

  useEffect(() => {
    if (!selectedCustomer) return;

    async function fetchCustomer() {
      try {
        const response = await fetchCustomerLedger(selectedCustomer);
        const formatted = response.ledger.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date).toISOString().split("T")[0],
        }));
        setLedgerData(formatted);
      } catch (error) {
        console.error("Failed to fetch customer ledger:", error);
      }
    }

    fetchCustomer();
  }, [selectedCustomer]);

  const columns = [
    { key: "date", header: "Date" },
    { key: "type", header: "Type" },
    {
      key: "amount",
      header: "Amount (₹)",
      render: (value: string | number) => {
        const num = typeof value === "number" ? value : parseFloat(value);
        return (
          <span className={num < 0 ? "text-red-500" : "text-green-600"}>
            ₹ {num.toFixed(2)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Select Customer</label>
        <Select onValueChange={(e)=>{
          setSelectedCustomer(e)
        }}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Choose a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer._id} value={customer.name}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ReusableTable columns={columns} data={ledgerData} itemsPerPage={5} />
    </div>
  );
};
