import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
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

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const signupMutation = useMutation({
    mutationFn: (userData: SignupFormData) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }).then((res) => {
        if (!res.ok) throw new Error("Signup failed");
        return res.json();
      }),

    onSuccess: () => {
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (error: Error) => {
      toast.error(`Signup failed: ${error.message}`);
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Left side - Career Booster info */}
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
              {/* You would replace this with your actual image */}
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

          {/* Right side - Sign up form */}
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
                Get started for free
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Unlock premium career tools for free.
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
              >
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <AppInput
                      {...field}
                      placeholder="Enter your first name"
                      fullWidth
                      margin="normal"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <AppInput
                      {...field}
                      placeholder="Enter your last name"
                      fullWidth
                      margin="normal"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
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
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
                  render={({ field }) => (
                    <AppInput
                      {...field}
                      placeholder="Create a password"
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
                  disabled={signupMutation.isLoading}
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
                  {signupMutation.isLoading ? "Signing up..." : "Sign up"}
                </AppButton>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 1, mb: 2 }}
                >
                  Already have an account? <Link href="/login">Login</Link>
                </Typography>
                <Grid container spacing={2}>
                  {/* <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: "#FF5733",
                        "&:hover": {
                          backgroundColor: "#E64A2E",
                        },
                        borderRadius: "9999px",
                      }}
                    >
                      Google
                    </Button>
                  </Grid> */}
                  {/* <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: "#FF5733",
                        "&:hover": {
                          backgroundColor: "#E64A2E",
                        },
                        borderRadius: "9999px",
                      }}
                    >
                      Facebook
                    </Button>
                  </Grid> */}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Signup;
