import React from "react";
import { useLanguage } from "../../../hooks/useLanguage";

interface Props {
  title: string;
}
const SectionTitle: React.FC<Props> = ({ title }) => {
  const { t } = useLanguage();
  return (
    <h2 className="my-4 md:my- lg:mt-8 mx-auto text-3xl">{t[`${title}`]}</h2>
  );
};

export default SectionTitle;
