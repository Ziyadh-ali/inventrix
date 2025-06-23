import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export const signupValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), "null"], "Passwords must match")
        .required("Confirm Password is required"),
});

export const customerValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("Address is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
});

export const saleValidationSchema = Yup.object().shape({
  date: Yup.date().required("Sale date is required"),
  customerName: Yup.string().required("Customer name is required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        quantity: Yup.number().min(1).required(),
      })
    )
    .min(1, "At least one item must be selected"),
});