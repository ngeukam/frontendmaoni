/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // i18n: {
  //   locales: [],
  //   defaultLocale: "en",
  //   localeDetection: false,
  // },
  images: {
    domains: ["127.0.0.1", "localhost", "api.maonidrive.com"],
    // unoptimized: process.env.NODE_ENV === "development", // Pour éviter l'optimisation en dev
  },
  
  webpack: function (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 100000,
          name: "[name].[ext]",
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;
