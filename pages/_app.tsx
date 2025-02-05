import type { AppProps } from "next/app";

import Layout from "../components/layout/Layout";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "react-toastify/dist/ReactToastify.css";

import "../styles/globals.css";
import Script from "next/script";
import SessionChecker from "../components/auth/CheckUserSession";
import TokenRefresher from "../components/auth/TokenRefresher";
import { LanguageProvider } from "../hooks/useLanguage";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Layout>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_GOOGLE_MAP}&libraries=places&loading=async`}
          strategy="lazyOnload"
        />
        <SessionChecker />
        <TokenRefresher />
        <Component {...pageProps} />
      </Layout>
    </LanguageProvider>
  );
}

export default MyApp;
