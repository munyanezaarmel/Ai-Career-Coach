import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import AppInput from "@/components/Input/Input";
import AppButton from "../Button/AppButton";
import Link from "next/link";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const loginMutation = useMutation({
    mutationFn: (userData: LoginFormData) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }).then((res) => {
        if (!res.ok) throw new Error("Login failed");
        return res.json();
      }),

    onSuccess: (data) => {
      // Store the token in localStorage or a secure cookie
      localStorage.setItem("token", data.token);
      toast.success("Login successful! Redirecting to home...");
      setTimeout(() => router.push("/home"), 2000);
    },
    onError: (error: Error) => {
      toast.error(`Login failed: ${error.message}`);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundColor: "#FFF1F0",
                borderRadius: "16px",
                padding: "32px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Boost your career with Gahigi!
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Discover tailored career advice and resources.
                </Typography>
              </Box>
              <Box
                component="img"
                src="/illustration.png"
                alt="Career boost illustration"
                sx={{ maxWidth: "100%", height: "auto", my: 4 }}
              />
              <Typography variant="body2">
                Enhance your career with expert advice.
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Login to access your account
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
              >
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <AppInput
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <AppInput
                      {...field}
                      placeholder="Enter password"
                      type="password"
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
                <AppButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loginMutation.isLoading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: "#FF5733",
                    "&:hover": {
                      backgroundColor: "#E64A2E",
                    },
                    borderRadius: "9999px",
                    padding: "12px 0",
                  }}
                >
                  {loginMutation.isLoading ? "Logging in..." : "Login"}
                </AppButton>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 1, mb: 2 }}
                >
                  New here? <Link href="/signup">Sign up</Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
