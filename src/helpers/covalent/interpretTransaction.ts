import { BigNumber } from "ethers";
import { NetworkId } from "src/constants";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { assert } from "src/helpers/types/assert";
import { CovalentTransaction } from "src/lib/covalent.types";

export interface Transaction {
  type: "bond" | "zap" | "staking" | "zap" | "migration" | "33together" | "borrow" | "transfer";
  token: Token;
  details: string;
  value: DecimalBigNumber;
  transaction: CovalentTransaction;
}

const isContract = (contractAddresses: Partial<Record<NetworkId, string>> | Token, address: string) =>
  Object.values(contractAddresses)
    .map(address => address.toLowerCase())
    .includes(address.toLowerCase());

export const interpretTransaction = (transactions: CovalentTransaction[], address: string) => {
  const results: Transaction[] = [];
  for (const transaction of transactions) {
    if (!transaction.log_events || transaction.log_events.length === 0) continue;

    assert(transaction.log_events, "Transactions w/o logs are ignored");
    const [first, second] = transaction.log_events;

    // if (isContract(STAKING_ADDRESSES, transaction.to_address)) {
    //   if (isContract(STAKING_ADDRESSES, first.decoded.params[0].value) && isContract(OHM_TOKEN, first.sender_address))
    //     results.push({
    //       token: OHM_TOKEN,
    //       transaction,
    //       type: "staking",
    //       details: "Unstake",
    //       value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), first.sender_contract_decimals),
    //     });
    //   else
    //     results.push({
    //       token: OHM_TOKEN,
    //       transaction,
    //       type: "staking",
    //       details: "Stake",
    //       value: new DecimalBigNumber(BigNumber.from(first.decoded.params[2].value), first.sender_contract_decimals),
    //     });
    // }
  }

  return results;
};
