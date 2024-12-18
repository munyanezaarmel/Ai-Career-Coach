import { AppProps } from "next/app";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";
import NProgress from "nprogress";
import { Router } from "next/router";

import theme from "../theme";
import "react-toastify/dist/ReactToastify.css";
import "nprogress/nprogress.css";

const queryClient = new QueryClient();

// Configure NProgress
NProgress.configure({ showSpinner: false });

// Add event listeners for route changes
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);
