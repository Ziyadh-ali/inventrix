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
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchItemSalesAndStock({
          limit: itemsPerPage,
          skip : (currentPage -1) * itemsPerPage,
        });
        setItemData(response.report.data);
        setTotalDataCount(response.report.total)
      } catch (error) {
        console.error("Error fetching item report:", error);
      }
    };

    fetchData();
  }, [currentPage]);

  const columns: TableColumn<ItemReportData>[] = [
    { key: "name", header: "Item" },
    { key: "sold", header: "Total Sold" },
    { key: "stock", header: "Stock Left" },
    { key: "price", header: "Price" },
    { key: "totalSales", header: "Total" },
  ];

  return <ReusableTable  columns={columns} data={itemData} itemsPerPage={itemsPerPage} onPageChange={(page)=>setCurrentPage(page)} totalItems={totalDataCount} />;
};
