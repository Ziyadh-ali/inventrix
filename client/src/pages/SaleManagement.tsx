import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ReusableTable } from "@/components/Table";
import { DatePicker } from "@/components/datepicker";
import { useFormik } from "formik";
import type { ICustomer, IItem, ISale, TableColumn } from "@/utils/interfaces";
import { addSale, fetchAllCustomer, fetchAllItem, fetchSale } from "@/services/services";
import { saleValidationSchema } from "@/utils/validation";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";




export const SaleManagement = () => {
    const [sales, setSales] = useState<ISale[]>([]);
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [items, setItems] = useState<IItem[]>([]);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSales() {
            const response = await fetchSale({
                limit: itemsPerPage,
                skip : (currentPage - 1) * itemsPerPage,
            });
            console.log(response)
            setSales(response.sales.data);
            setTotalDataCount(response.sales.total)
        }
        fetchSales();
    }, [location , currentPage]);

    useEffect(() => {
        async function fetchCustomers() {
            const response = await fetchAllCustomer();
            setCustomers(response.customers);
        }
        fetchCustomers();
    }, [location]);

    useEffect(() => {
        async function fetchCustomers() {
            const response = await fetchAllItem();
            setItems(response.items);
        }
        fetchCustomers();
    }, [location]);

    const formik = useFormik({
        initialValues: {
            date: null as Date | null,
            customerName: "",
            items: [] as { name: string; quantity: number, price: number , stock : number }[],
        },
        validationSchema: saleValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                if (!values.date) {
                    toast.error("Date is required");
                    return;
                }

                const saleData: Omit<ISale, "_id"> = {
                    date: values.date,
                    customerName: values.customerName,
                    items: values.items,
                };

                const response = await addSale(saleData);

                toast.success(response.message);
                navigate("/dashboard/sales");
                resetForm();
            } catch (error) {
                    toast.error((error instanceof AxiosError)? 
                        error.response?.data.message : 
                        "Error in Submitting"
                    )
            }
        }
    });

    const handleAddItem = (itemName: string) => {
        if (!formik.values.items.find(i => i.name === itemName)) {
            const matchedItem = items.find(i => i.name === itemName);
            console.log(matchedItem);
            if (!matchedItem) return;
            formik.setFieldValue("items", [
                ...formik.values.items,
                {
                    name: matchedItem.name,
                    quantity: 1,
                    price: matchedItem.price,
                    stock: matchedItem.quantity,
                },
            ]);
        }
    };

    const handleQuantityChange = (item: string, delta: number) => {
        const updatedItems = formik.values.items.map(i =>
            i.name === item ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        );
        formik.setFieldValue("items", updatedItems);
    };

    const handleRemoveItem = (item: string) => {
        const filtered = formik.values.items.filter(i => i.name !== item);
        formik.setFieldValue("items", filtered);
    };

    const saleColumns: TableColumn<ISale>[] = [
        {
            key: "date",
            header: "Date",
            render: (value) => new Date(value as Date).toLocaleDateString(),
        },
        {
            key: "customerName",
            header: "Customer",
        },
        {
            key: "items",
            header: "Items",
            render: (_, row) =>
                row.items.map((i) => `${i.name} (${i.quantity})`).join(", "),
        },
        {
            key: "items",
            header: "Total Amount",
            render: (_, row) =>
                `₹ ${row.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}`
        }

    ];

    return (
        <DashboardLayout>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Sale Record</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <DatePicker selected={formik.values.date} onChange={(date) => formik.setFieldValue("date", date)} />
                                {formik.touched.date && formik.errors.date && (
                                    <p className="text-sm text-red-500">{formik.errors.date}</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <select
                                    className="w-full border rounded-md p-2"
                                    name="customerName"
                                    value={formik.values.customerName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    <option value="" disabled>Select an Customer</option>
                                    {customers.map((c) => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                {formik.touched.customerName && formik.errors.customerName && (
                                    <p className="text-sm text-red-500">{formik.errors.customerName}</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <select
                                    className="w-full border rounded-md p-2"
                                    onChange={(e) => handleAddItem(e.target.value)}
                                    value=""
                                >
                                    <option value="" disabled>Select an item</option>
                                    {items.map((item) => (
                                        <option key={item._id} value={item.name}>{item.name}</option>
                                    ))}
                                </select>
                                {formik.touched.items && typeof formik.errors.items === "string" && (
                                    <p className="text-sm text-red-500">{formik.errors.items}</p>
                                )}
                            </div>
                        </div>

                        {/* Selected Items Table */}
                        {formik.values.items.length > 0 && (
                            <div className="border rounded p-4 shadow-sm">
                                <h4 className="font-semibold mb-4 text-base">Selected Items</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead className="bg-gray-100 text-left">
                                            <tr>
                                                <th className="px-4 py-2">Item</th>
                                                <th className="px-4 py-2">Available Stock</th>
                                                <th className="px-4 py-2 text-center">Quantity</th>
                                                <th className="px-4 py-2 text-right">Unit Price (₹)</th>
                                                <th className="px-4 py-2 text-right">Total (₹)</th>
                                                <th className="px-4 py-2 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formik.values.items.map((item, index) => (
                                                <tr key={item.name} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                    <td className="px-4 py-2">{item.name}</td>
                                                    <td className="px-4 py-2">{item.stock}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <Button
                                                                disabled= {item.quantity === 1}
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleQuantityChange(item.name, -1)}
                                                            >
                                                                −
                                                            </Button>
                                                            <span>{item.quantity}</span>
                                                            <Button
                                                                disabled = {item.quantity === item.stock}
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleQuantityChange(item.name, 1)}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2 text-right">₹ {item.price.toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-right">
                                                        ₹ {(item.price * item.quantity).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleRemoveItem(item.name)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="text-right font-semibold mt-4">
                                    Grand Total: ₹{" "}
                                    {formik.values.items
                                        .reduce((sum, i) => sum + i.price * i.quantity, 0)
                                        .toFixed(2)}
                                </div>
                            </div>
                        )}


                        <Button type="submit">Save Sale</Button>
                    </form>

                    <div className="pt-6">
                        <h3 className="font-semibold text-lg mb-2">Sales List</h3>
                        <ReusableTable
                            columns={saleColumns}
                            data={sales}
                            itemsPerPage={itemsPerPage}
                            onPageChange={(page)=>{
                                setCurrentPage(page)
                            }}
                            totalItems={totalDataCount}
                        />
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};
