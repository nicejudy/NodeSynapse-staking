import { Signer, ethers } from "ethers";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkId } from "src/networkDetails";
import Cookies from "universal-cookie";
import { NftManagerContract__factory } from "src/typechain";
import { NFT_MANAGER, ZERO_ADDRESS } from "src/constants/addresses";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { loadAccountDetails } from "./AccountSlice";
import { loadAppDetails } from "./AppSlice";
import { getGasPrice } from "src/helpers/get-gas-price";
import { messages } from "src/constants/messages";
import { toast } from "react-hot-toast";
import { sleep } from "src/helpers/sleep";
import { metamaskErrorWrap } from "src/helpers/metamask-error-wrap";
import rot13 from "src/lib/encode";
import { galleryDetails } from "./GallerySlice";

interface ICreateNft {
  number: number;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  signer: Signer;
  address: string;
  wl: boolean;
  networkID: NetworkId;
  handleClose: () => void;
}

export const createNft = createAsyncThunk(
  "mint/createNft",
  async ({ number, provider, signer, address, wl, networkID, handleClose }: ICreateNft, { dispatch }) => {
    if (!provider || !signer) {
      toast.error(messages.please_connect_wallet);
      return;
    }
    const nftManager = new ethers.Contract(
      NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      NftManagerContract__factory.abi,
      signer,
    );
    const cookies = new Cookies();
    const ref = cookies.get("ref");

    let tx;
    try {
      if (!wl) {
        const mintPrice = Number(await nftManager.mintPrice()) / Math.pow(10, 18);    
        const etherValue = mintPrice * number;
  
        tx = await nftManager.createNFT(number, ref ? rot13(ref) : address, {
          value: ethers.utils.parseEther(etherValue.toFixed(3)),
        });  
        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Creating NFT", type: "creating" }));
      } else {
        const mintPrice = Number(await nftManager.mintPriceWhitelisted()) / Math.pow(10, 18);    
        const etherValue = mintPrice;
  
        tx = await nftManager.createNFTWhitelisted({
          value: ethers.utils.parseEther(etherValue.toFixed(3)),
        });  
        dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Creating NFT as WL", type: "creating" }));
      }
      await tx.wait();
      handleClose();
      toast.success(messages.tx_successfully_send);
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    cookies.set("whitelist", "1")
    await sleep(2);
    toast.success(messages.your_data_update_soon);
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(galleryDetails({ networkID, provider }));
    toast.success(messages.your_data_updated);
    return;
  },
);

interface IUpgradeNft {
  id: string;
  quantity: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  signer?: Signer;
  address: string;
  networkID: NetworkId;
}

export const upgradeNft = createAsyncThunk(
  "mint/upgradeNft",
  async ({ id, quantity, provider, signer, address, networkID }: IUpgradeNft, { dispatch }) => {
    if (!provider) {
      toast.error(messages.please_connect_wallet);
      return;
    }
    // const signer = provider.getSigner();
    const amount = quantity.replace(/,/g, "")
    const nftManager = new ethers.Contract(
      NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      NftManagerContract__factory.abi,
      signer,
    );
    const cookies = new Cookies();
    const ref = cookies.get("milk_ref");
    let tx;

    try {
      const gasPrice = await getGasPrice(provider);

      tx = await nftManager.stakeTokens(id, ethers.utils.parseUnits(amount, "ether"), ref ? rot13(ref) : address, {
        gasPrice: gasPrice,
      });

      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Staking MILK", type: "staking" }));
      await tx.wait();
      toast.success(messages.tx_successfully_send);
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    await sleep(2);
    toast.success(messages.your_data_update_soon);
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(galleryDetails({ networkID, provider }));
    toast.success(messages.your_data_updated);
    return;
  },
);

interface ITransferNft {
  tokenId?: string;
  to: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  signer?: Signer;
  address: string;
  networkID: NetworkId;
}

export const transferNft = createAsyncThunk(
  "mint/transferNft",
  async ({ tokenId, to, provider, signer, address, networkID }: ITransferNft, { dispatch }) => {
    if (!provider) {
      toast.error(messages.please_connect_wallet);
      return;
    }
    // const signer = provider.getSigner();
    const nftManager = new ethers.Contract(
      NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      NftManagerContract__factory.abi,
      signer,
    );

    let tx;

    try {
      const gasPrice = await getGasPrice(provider);

      tx = await nftManager.transferFrom(address, to, tokenId, { gasPrice });

      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Transferring NFT", type: "transferring" }));
      await tx.wait();
      toast.success(messages.tx_successfully_send);
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    await sleep(2);
    toast.success(messages.your_data_update_soon);
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(galleryDetails({ networkID, provider }));
    toast.success(messages.your_data_updated);
    return;
  },
);

interface IBasicInterface {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: NetworkId;
}
interface ICompoundAll {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: NetworkId;
  signer: Signer;
}

export const compoundAll = createAsyncThunk(
  "mint/compoundAll",
  async ({ provider, signer, address, networkID }: ICompoundAll, { dispatch }) => {
    if (!provider) {
      toast.error(messages.please_connect_wallet);
      return;
    }
    // const signer = provider.getSigner();
    const nftManager = new ethers.Contract(
      NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      NftManagerContract__factory.abi,
      signer,
    );

    let tx;

    try {
      const gasPrice = await getGasPrice(provider);

      tx = await nftManager.compoundAll({ gasPrice });

      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Compounding All", type: "allcompounding" }));
      await tx.wait();
      toast.success(messages.tx_successfully_send);
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    await sleep(2);
    toast.success(messages.your_data_update_soon);
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(galleryDetails({ networkID, provider }));
    toast.success(messages.your_data_updated);
    return;
  },
);

interface ICashoutAll {
  swapping: boolean;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: NetworkId;
  signer?: Signer;
}

export const claimAll = createAsyncThunk(
  "mint/claimAll",
  async ({ swapping, provider, signer, address, networkID }: ICashoutAll, { dispatch }) => {
    if (!provider) {
      toast.error(messages.please_connect_wallet);
      return;
    }
    // const signer = provider.getSigner();
    const nftManager = new ethers.Contract(
      NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      NftManagerContract__factory.abi,
      signer,
    );

    let tx;

    try {
      const gasPrice = await getGasPrice(provider);

      tx = await nftManager.cashoutAll(swapping, { gasPrice });

      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Claim All", type: "allclaiming" }));
      await tx.wait();
      toast.success(messages.tx_successfully_send);
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    await sleep(2);
    toast.success(messages.your_data_update_soon);
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(galleryDetails({ networkID, provider }));
    toast.success(messages.your_data_updated);
    return;
  },
);

interface ICompoundNft {
  nftId: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: NetworkId;
  signer: Signer;
}

export const compoundReward = createAsyncThunk(
  "mint/compoundReward",
  async ({ nftId, provider, signer, address, networkID }: ICompoundNft, { dispatch }) => {
    if (!provider) {
      toast.error(messages.please_connect_wallet);
      return;
    }
    // const signer = provider.getSigner();
    const nftManager = new ethers.Contract(
      NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      NftManagerContract__factory.abi,
      signer,
    );

    let tx;

    try {
      const gasPrice = await getGasPrice(provider);

      tx = await nftManager.compoundReward(nftId, { gasPrice });

      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Compounding $MILK", type: "compounding" }));
      await tx.wait();
      toast.success(messages.tx_successfully_send);
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    await sleep(2);
    toast.success(messages.your_data_update_soon);
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(galleryDetails({ networkID, provider }));
    toast.success(messages.your_data_updated);
    return;
  },
);

interface ICashoutNft {
  nftId: string;
  swapping: boolean;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: NetworkId;
  signer: Signer;
}

export const cashoutReward = createAsyncThunk(
  "mint/cashoutReward",
  async ({ nftId, swapping, provider, signer, address, networkID }: ICashoutNft, { dispatch }) => {
    if (!provider) {
      toast.error(messages.please_connect_wallet);
      return;
    }
    // const signer = provider.getSigner();
    const nftManager = new ethers.Contract(
      NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      NftManagerContract__factory.abi,
      signer,
    );

    let tx;

    try {
      const gasPrice = await getGasPrice(provider);

      tx = await nftManager.cashoutReward(nftId, swapping, { gasPrice });

      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: "Claiming $MILK", type: "claiming" }));
      await tx.wait();
      toast.success(messages.tx_successfully_send);
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    await sleep(2);
    toast.success(messages.your_data_update_soon);
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(galleryDetails({ networkID, provider }));
    toast.success(messages.your_data_updated);
    return;
  },
);
