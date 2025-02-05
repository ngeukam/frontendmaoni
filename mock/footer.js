import { FaLinkedin, FaTwitterSquare, FaTelegramPlane } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

export const footerContent = [
  {
    title: "MaoniDrivepMap",
    subtitles: [
      {
        text: "aboutUs",
        href: "/about",
      },
      {
        text: "contactUs",
        href: "/contactus",
      },
    ],
  },
  {
    title: "customerServices",
    subtitles: [
      {
        text: "requestQuote",
        href: "/blank",
      },
      {
        text: "privacy",
        href: "/blank",
      },
    ],
  },
];

export const socialMedia = [
  {
    name: "instagram",
    icon: AiFillInstagram,
    href: "/",
  },
  {
    name: "linkedin",
    icon: FaLinkedin,
    href: "/",
  },
  {
    name: "twitter",
    icon: FaTwitterSquare,
    href: "/",
  },
  {
    name: "telegram",
    icon: FaTelegramPlane,
    href: "/",
  },
];
