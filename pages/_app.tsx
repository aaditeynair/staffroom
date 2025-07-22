import "@/styles/globals.css";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import GlobalStyles from "@mui/material/GlobalStyles";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#008080",
      },
    },
  });

  return (
    <AppCacheProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppCacheProvider>
  );
}
