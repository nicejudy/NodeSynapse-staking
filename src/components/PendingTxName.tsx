import { CircularProgress } from "@mui/material";
import { FC } from "react";
import { useAppSelector } from "src/hooks";

export interface IPendingTxName {
  name?: string;
}

/**
 * Component for Displaying Pending Label
 */
const PendingTxName: FC<IPendingTxName> = ({ name }) => {
  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  return (
    <>
      {pendingTransactions.length === 0 || TransactioonTypeFromLabel(name ?? "") !== pendingTransactions[0].type ? (
        name
      ) : (
        <>
          <CircularProgress style={{ width: "20px", height: "20px", marginRight: "10px" }} />
          {pendingTransactions[0].text}
        </>
      )}
    </>
  );
};

const TransactioonTypeFromLabel = (label: string) => {
  let type = "";
  switch (label) {
    case "Claim":
      type = "claiming";
      break;
    case "Compound":
      type = "compounding";
      break;
    case "Compound All":
      type = "allcompounding";
      break;
    case "Claim All":
      type = "allclaiming";
      break;
    case "Transfer NFT":
      type = "transferring";
      break;
    case "Stake":
      type = "staking";
      break;
    case "Buy":
      type = "creating";
      break;
  }
  return type;
};

export default PendingTxName;
