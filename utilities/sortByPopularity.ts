import { IBusiness } from "../lib/types/business";

export const sortByPoPularity = (
  product1: IBusiness,
  product2: IBusiness
): number => {
  const evaluation1 = product1.total_evaluation || 0; // Default to 0 if undefined
  const evaluation2 = product2.total_evaluation || 0; // Default to 0 if undefined
  return evaluation2 - evaluation1;
};
