import "@/styles/globals.css";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppCacheProvider>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <Component {...pageProps} />
    </AppCacheProvider>
  );
}
