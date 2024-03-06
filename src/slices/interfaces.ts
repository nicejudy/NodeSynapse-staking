import { BaseProvider, JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, Signer } from "ethers";
import { NetworkId } from "src/constants";

export interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkId;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider | BaseProvider;
}

export interface IValueOnlyAsyncThunk extends IBaseAsyncThunk {
  readonly value: BigNumber;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk {
  readonly action: string;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}
