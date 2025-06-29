/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ReusableTable } from "@/components/Table";
import { fetchCustomerLedger, fetchAllCustomer } from "@/services/services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { ICustomer, TableColumn } from "@/utils/interfaces";

type LedgerEntry = {
  date: string;
  type: "Sale" | "Payment" | "Return"; // Adjust based on actual types
  amount: number;
};

export const CustomerLedger = () => {
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [totalLedgerCount, setTotalLedgerCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  // Fetch all customers on mount
  useEffect(() => {
    async function getCustomers() {
      try {
        setIsLoading(true);
        const response = await fetchAllCustomer();
        setCustomers(response.customers);
      } catch (err) {
        toast.error("Failed to fetch customers");
        console.error("Failed to fetch customers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    getCustomers();
  }, []);

  // Fetch ledger data when selectedCustomer or currentPage changes
  useEffect(() => {
    if (!selectedCustomer) {
      setLedgerData([]);
      setTotalLedgerCount(0);
      return;
    }

    async function fetchLedger() {
      try {
        setIsLoading(true);
        const response = await fetchCustomerLedger( selectedCustomer, {
          limit: itemsPerPage,
          skip: (currentPage - 1) * itemsPerPage,
        });
        console.log(response)
        const formatted = response.ledger.data.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date).toISOString().split("T")[0],
        }));
        setLedgerData(formatted);
        setTotalLedgerCount(response.ledger.total);
      } catch (error) {
        toast.error("Failed to fetch customer ledger");
        console.error("Failed to fetch customer ledger:", error);
        setLedgerData([]);
        setTotalLedgerCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLedger();
  }, [selectedCustomer, currentPage]);

  const columns: TableColumn<LedgerEntry>[] = [
  {
    key: "date",
    header: "Date",
    render: (value) => new Date(value as string).toLocaleDateString()
  },
  {
    key: "type",
    header: "Type"
  },
  {
    key: "amount",
    header: "Amount",
    render: (value) => <span>₹ {(value as number).toFixed(2)}</span>
  }
];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Ledger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Select Customer</label>
          <Select
            onValueChange={(value) => {
              setSelectedCustomer(value);
              setCurrentPage(1);
            }}
            value={selectedCustomer}
            disabled={isLoading}
          >
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

        <ReusableTable
          columns={columns}
          data={ledgerData}
          itemsPerPage={itemsPerPage}
          totalItems={totalLedgerCount}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </CardContent>
    </Card>
  );
};