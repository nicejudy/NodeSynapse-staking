import { useQuery } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

export const currentIndexQueryKey = () => ["useCurrentIndex"];

export const useCurrentIndex = () => {
  return 1;
};
