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
import { toast } from "sonner";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { useConfirmModal } from "@/components/hooks/useConfirmModal";
import {
    addItem,
    editItem,
    deleteItem,
    fetchItems,
} from "@/services/services"; // Make sure these service functions exist
import * as Yup from "yup";
import type { IItem } from "@/utils/interfaces";
import { useLocation, useNavigate } from "react-router-dom";

const itemValidationSchema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    quantity: Yup.number().required("Quantity is required").min(0),
    price: Yup.number().required("Price is required").min(0),
    description: Yup.string().required("description is required"),
});

export const ItemManagement = () => {
    const [items, setItems] = useState<IItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
    const [currentPage,] = useState(1);
    const itemsPerPage = 5;
    const skip = (currentPage - 1) * itemsPerPage;
    const location = useLocation();
    const navaigate = useNavigate();

    const confirmModal = useConfirmModal();

    const fetchItemList = async () => {
        const response = await fetchItems({
            limit: itemsPerPage,
            skip,
        });
        console.log(response)
        setItems(response.items.data || []);
    };

    useEffect(() => {
        fetchItemList();
        //eslint-disable-next-line
    }, [location]);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            quantity: 0,
            price: 0,
        },
        validationSchema: itemValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            if (selectedItem) {
                const response = await editItem(selectedItem._id, values);
                toast.success(response.message);
            } else {
                const response = await addItem(values);
                toast.success(response.message);
            }
            navaigate("/dashboard/items");
            resetForm();
            setSelectedItem(null);
        },
    });

    const handleDelete = (item: IItem) => {
        confirmModal.openModal({
            title: "Delete Item",
            description: `Are you sure you want to delete "${item.name}"?`,
            onConfirm: async () => {
                const response = await deleteItem(item._id);
                toast.success(response.message);
                confirmModal.closeModal();
                navaigate("/dashboard/items");
            },
        });
    };

    const columns = [
        { key: "name", header: "Name" },
        { key: "description", header: "Description" },
        { key: "quantity", header: "Quantity" },
        { key: "price", header: "Price" },
    ];

    const actions = [
        {
            label: "Edit",
            onClick: (row: IItem) => {
                formik.setValues(row);
                setSelectedItem(row);
            },
        },
        {
            label: "Delete",
            onClick: handleDelete,
        },
    ];

    return (
        <>
            <DashboardLayout>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Item Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={formik.handleSubmit} className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                        name="description"
                                        placeholder="Description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.description && formik.errors.description && (
                                        <p className="text-sm text-red-500">{formik.errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        type="number"
                                        name="quantity"
                                        placeholder="Quantity"
                                        value={formik.values.quantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.quantity && formik.errors.quantity && (
                                        <p className="text-sm text-red-500">{formik.errors.quantity}</p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        type="number"
                                        name="price"
                                        placeholder="Price"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.price && formik.errors.price && (
                                        <p className="text-sm text-red-500">{formik.errors.price}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit">
                                    {selectedItem ? "Update Item" : "Add Item"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setSelectedItem(null);
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
                            data={items}
                            actions={actions}
                            itemsPerPage={itemsPerPage}
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
