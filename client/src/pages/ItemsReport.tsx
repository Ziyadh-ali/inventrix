import { useEffect, useState } from "react";
import { ReusableTable } from "@/components/Table";
import { fetchItemSalesAndStock } from "@/services/services"; // make sure the path is correct
import type { TableColumn } from "@/utils/interfaces";

type ItemReportData = {
  name: string;
  sold: number;
  stock: number;
  price: number,
  totalSales: number
};

export const ItemsReport = () => {
  const [itemData, setItemData] = useState<ItemReportData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchItemSalesAndStock();
        setItemData(data.report);
      } catch (error) {
        console.error("Error fetching item report:", error);
      }
    };

    fetchData();
  }, []);

  const columns: TableColumn<ItemReportData>[] = [
    { key: "name", header: "Item" },
    { key: "sold", header: "Total Sold" },
    { key: "stock", header: "Stock Left" },
    { key: "price", header: "Price" },
    { key: "totalSales", header: "Total" },
  ];

  return <ReusableTable columns={columns} data={itemData} itemsPerPage={5} />;
};
