import { useState } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginValidationSchema, signupValidationSchema } from "@/utils/validation";
import { userLoginService, userSignupService } from "@/services/services";
import { useDispatch } from "react-redux";
import { userLogin } from "@/store/slices/userSlice";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const AuthForm = () => {
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const validationSchema = isSignup ? signupValidationSchema : loginValidationSchema;

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (isSignup) {
                    const { message } = await userSignupService(values);
                    toast.success(message);
                } else {
                    const { user, accessToken, message } = await userLoginService(values);
                    dispatch(userLogin({ id: user._id, email: user.email, accessToken }));
                    navigate("/dashboard/customers")
                    toast.success(message);
                }
            } catch (err) {
                const msg =
                    err instanceof AxiosError && err.response
                        ? err.response.data?.message ?? "Request failed"
                        : "Something went wrong";
                toast.error(msg);
                console.error("Form submission error:", err);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                    {isSignup ? "Create Account" : "Login"}
                </h2>

                <form
                    noValidate
                    className="space-y-4"
                    onSubmit={formik.handleSubmit}
                >
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="text-sm text-red-500">{formik.errors.email}</div>
                    )}

                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <div className="text-sm text-red-500">{formik.errors.password}</div>
                    )}

                    {isSignup && (
                        <>
                            <Input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="text-sm text-red-500">
                                    {formik.errors.confirmPassword}
                                </div>
                            )}
                        </>
                    )}

                    <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
                        {isSignup ? "Sign Up" : "Login"}
                    </Button>
                </form>

                {/* Toggle Auth Mode */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {isSignup
                            ? "Already have an account? Login"
                            : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
};