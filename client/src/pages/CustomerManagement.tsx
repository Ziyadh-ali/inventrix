import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { ReusableTable } from "@/components/Table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/DashboardLayout";
import { customerValidationSchema } from "@/utils/validation";
import { addCustomer, deleteCustomer, editCustomer, fetchCustomer } from "@/services/services";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useConfirmModal } from "@/components/hooks/useConfirmModal";
import { useLocation, useNavigate } from "react-router-dom";

type Customer = {
    _id: string;
    name: string;
    address: string;
    mobile: string;
};

export const CustomerManagement = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [totalCustomerCount, setTotalCustomerCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    const location = useLocation();
    const navigate = useNavigate();
    const confirmModal = useConfirmModal();

    // Fetch customers when page or location changes
    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await fetchCustomer({
                    limit: itemsPerPage,
                    skip: (currentPage - 1) * itemsPerPage,
                });
                setCustomers(response.customers.data);
                setTotalCustomerCount(response.customers.total);
            } catch (error) {
                console.log(error)
                toast.error("Failed to fetch customers");
            }
        }
        fetchCustomers();
    }, [currentPage, location]);

    const formik = useFormik({
        initialValues: { name: "", address: "", mobile: "" },
        validationSchema: customerValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                let response;
                if (selectedCustomer) {
                    response = await editCustomer(selectedCustomer._id, {
                        name: values.name,
                        address: values.address,
                        mobile: parseInt(values.mobile),
                    });
                    toast.success(response.message);
                    setSelectedCustomer(null);
                    resetForm();
                } else {
                    response = await addCustomer({
                        name: values.name,
                        address: values.address,
                        mobile: parseInt(values.mobile),
                    });
                    toast.success(response.message);
                    resetForm();
                }
                // Refresh customer list after add/edit
                const responseData = await fetchCustomer({
                    limit: itemsPerPage,
                    skip: (currentPage - 1) * itemsPerPage,
                });
                setCustomers(responseData.customers.data);
                setTotalCustomerCount(responseData.customers.total);
                navigate("/dashboard/customers");
            } catch (error) {
                console.log(error);
                toast.error("Operation failed");
            }
        },
    });

    const columns = [
        { key: "name", header: "Name" },
        { key: "address", header: "Address" },
        { key: "mobile", header: "Mobile" },
    ];

    const actions = [
        {
            label: "Edit",
            onClick: (row: Customer) => {
                formik.setValues(row);
                setSelectedCustomer(row);
            },
        },
        {
            label: "Delete",
            onClick: (row: Customer) => {
                confirmModal.openModal({
                    title: "Delete Customer",
                    description: `Are you sure you want to delete ${row.name}?`,
                    onConfirm: async () => {
                        try {
                            const response = await deleteCustomer(row._id);
                            // Update customer list without full refetch
                            setCustomers(customers.filter((c) => c._id !== row._id));
                            setTotalCustomerCount((prev) => prev - 1);
                            // Adjust page if current page becomes empty
                            if (
                                customers.length === 1 &&
                                currentPage > 1 &&
                                (currentPage - 1) * itemsPerPage >= totalCustomerCount - 1
                            ) {
                                setCurrentPage((prev) => prev - 1);
                            }
                            confirmModal.closeModal();
                            toast.success(response.message);
                        } catch (error) {
                            console.log(error)
                            toast.error("Failed to delete customer");
                        }
                    },
                });
            },
        },
    ];

    return (
        <>
            <DashboardLayout>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Customer Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Form */}
                        <form
                            onSubmit={formik.handleSubmit}
                            className="space-y-4 mb-6"
                            noValidate
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <p className="text-sm text-red-500">{formik.errors.name}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        type="text"
                                        name="address"
                                        placeholder="Address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.address && formik.errors.address && (
                                        <p className="text-sm text-red-500">{formik.errors.address}</p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        type="text"
                                        name="mobile"
                                        placeholder="Mobile"
                                        value={formik.values.mobile}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.mobile && formik.errors.mobile && (
                                        <p className="text-sm text-red-500">{formik.errors.mobile}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">
                                    {selectedCustomer ? "Update Customer" : "Add Customer"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCustomer(null);
                                        formik.resetForm();
                                    }}
                                    variant="outline"
                                >
                                    Clear
                                </Button>
                            </div>
                        </form>

                        <ReusableTable
                            columns={columns}
                            data={customers}
                            actions={actions}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalCustomerCount}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                            }}
                        />
                    </CardContent>
                </Card>
            </DashboardLayout>
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                description={confirmModal.description}
                onConfirm={confirmModal.onConfirm}
                onCancel={confirmModal.closeModal}
            />
        </>
    );
};