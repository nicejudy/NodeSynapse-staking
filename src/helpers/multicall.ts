import { ethers } from "ethers";
import { MulticallContract__factory } from "src/typechain";
import { BlockTag } from "@ethersproject/abstract-provider";
import { BaseProvider, JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { Interface } from '@ethersproject/abi'
import { BigNumberish } from "@ethersproject/bignumber";
import { AccessListish } from "@ethersproject/transactions";
import { MULTICALL_ADDRESS, RPC_URL } from "src/constants/addresses";
import { useNetwork } from "wagmi";
import { NetworkId } from "src/networkDetails";

export interface Call {
    address: string // Address of the contract
    name: string // Function name on the contract (example: balanceOf)
    params?: any[] // Function params
}

export interface Overrides {
    gasLimit?: BigNumberish | Promise<BigNumberish>;
    gasPrice?: BigNumberish | Promise<BigNumberish>;
    maxFeePerGas?: BigNumberish | Promise<BigNumberish>;
    maxPriorityFeePerGas?: BigNumberish | Promise<BigNumberish>;
    nonce?: BigNumberish | Promise<BigNumberish>;
    type?: number;
    accessList?: AccessListish;
    customData?: Record<string, any>;
};

export interface PayableOverrides extends Overrides {
    value?: BigNumberish | Promise<BigNumberish>;
}

export interface CallOverrides extends PayableOverrides {
    blockTag?: BlockTag | Promise<BlockTag>;
    from?: string | Promise<string>;
}
  
export interface MulticallOptions extends CallOverrides {
    requireSuccess?: boolean
}

const simpleRpcProvider = new StaticJsonRpcProvider(RPC_URL)

export const multicall = async <T = any>(abi: any[], calls: Call[], chainId?: NetworkId,  provider?:StaticJsonRpcProvider | JsonRpcProvider | BaseProvider, options?: MulticallOptions): Promise<T> => {
    const { requireSuccess = true, ...overrides } = options || {}
    // const { chain = { id: 8453 } } = useNetwork();
    // console.log('debug multicall', chain)
    
    const multi = MulticallContract__factory.connect(MULTICALL_ADDRESS[chainId as keyof typeof MULTICALL_ADDRESS], provider??simpleRpcProvider)

    const itf = new Interface(abi)
  
    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))
  
    const returnData = await multi.tryAggregate(requireSuccess, calldata, overrides)
    const res = returnData.map((call: any, i: any) => {
      const [result, data] = call
      return result ? itf.decodeFunctionResult(calls[i].name, data) : null
    })
  
    return res as any
  }