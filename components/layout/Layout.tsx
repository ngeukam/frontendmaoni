import React from "react";
import { Provider } from "react-redux";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import Header from "../header";
import store from "../../store/index";
import Footer from "../footer";
import { ToastContainer } from "react-toastify";
import NextNProgress from "nextjs-progressbar";
import { useLanguage } from "../../hooks/useLanguage";
import Image from "next/image";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isLoadingLanguage, detectedLanguage } = useLanguage();
  if (isLoadingLanguage) {
    return (
      <div className="flex justify-center items-center h-screen"> {/* Center the spinner */}
        <Image
          src="/images/logo.png"
          alt="maonidrive-logo"
          width={220}
          height={125}
          objectFit="contain"
        />
      </div>
    )
  }
  return (
    <Provider store={store}>
      <ThemeProvider enableSystem={true} attribute="class">
        <Head>
          <meta
            name="description"
            content={
              detectedLanguage === "en" ?
                "MaoniDrive is the trusted platform where customers share authentic reviews on business products and services." :
                "MaoniDrive est la plateforme où les clients partagent leurs avis authentiques sur les produits et services des entreprises."}
          />
          <title>MaoniDrive</title>
        </Head>
        <div className="flex flex-col min-h-[100vh]">
          <NextNProgress height={7} />
          <Header />
          <main className="flex-grow  md:mt-40">{children}</main>
          <Footer />
        </div>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          position="top-right"
        />
      </ThemeProvider>
    </Provider>
  );
};

export default Layout;
