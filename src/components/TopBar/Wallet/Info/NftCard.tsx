import { Box, Button, Switch, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import LoadingIcon from "src/assets/icons/loading.gif";
import { getValidChainId } from "src/constants/data";
// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import { generateImage } from "src/helpers/NFTInfo/generateImage";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useAppSelector } from "src/hooks";
import { NetworkId } from "src/networkDetails";
import { cashoutReward, upgradeNft } from "src/slices/NftThunk";
import { getPendingReward, loadUserInfoDetails } from "src/slices/search-slice";
import { getExtraDailyAPRByLevel } from "src/views/NftItem";
import { useAccount, useNetwork, useSigner } from "wagmi";

interface INftCardProps {
  nftId: string;
  // totalStaked: string;
  // totalStakers: string;
  // owner: string;
  // level: string;
  // nftLastProcessingTimestamp: string;
  isOwned: boolean;
  handleOpen: (a: string) => void;
}

function NftCard({
  nftId,
  // totalStaked,
  // totalStakers,
  // owner,
  // level,
  // nftLastProcessingTimestamp,
  isOwned,
}: // handleOpen,
INftCardProps) {
  const theme = useTheme();
  const gallery = useAppSelector(state => {
    return state.gallery.nfts;
  });
  const { data: signer } = useSigner();
  const dispatch = useDispatch();
  const totalStaked = gallery[parseInt(nftId) - 1].totalStakedAmount;
  const totalStakers = gallery[parseInt(nftId) - 1].totalStakers;
  const owner = gallery[parseInt(nftId) - 1].owner;
  const level = gallery[parseInt(nftId) - 1].level;
  const nftLastProcessingTimestamp = gallery[parseInt(nftId) - 1].nftLastProcessingTimestamp;
  const nftLastReward = gallery[parseInt(nftId) - 1].nftLastReward;

  const { address = "", isConnected, isReconnecting } = useAccount();
  const { chain = { id: 8453 } } = useNetwork();
  const provider = Providers.getStaticProvider(getValidChainId(chain.id) as NetworkId);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [pendingReward, setPendingReward] = useState(0);
  const [lastProcessingTimestamp, setLastProcessingTimestamp] = useState(0);
  const [isSwap, setIsSwap] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 400px)");

  let ownerReward = 0;
  const nftImg = generateImage({
    tokenId: parseInt(nftId),
    level: level,
    lockers: totalStakers,
    tvl: Math.floor(totalStaked),
    ownerAddress: owner,
  });

  const handleIsSwapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSwap(event.target.checked);
  };

  if (owner.toLowerCase() == address.toLowerCase()) {
    const rewardRate = getExtraDailyAPRByLevel(level, true);
    ownerReward = getPendingReward(totalStaked, rewardRate, nftLastProcessingTimestamp, true) + nftLastReward;
  } else {
    ownerReward = 0;
  }
  useEffect(() => {
    const UserInfoDetails = async () => {
      const data = await loadUserInfoDetails({ networkID: getValidChainId(chain.id) as NetworkId, id: nftId ?? "1", address, provider });
      setStakedAmount(data.stakedAmount);
      setLastProcessingTimestamp(data.lastProcessingTimestamp);
      setPendingReward(data.pendingReward);
    };

    if (isConnected && address) {
      UserInfoDetails();
    }
  }, [nftId, address, isConnected]);

  const onClaim = async (swapping: boolean) => {
    // if (await checkWrongNetwork()) return;
    dispatch(cashoutReward({ nftId, swapping, provider, signer, address, networkID: getValidChainId(chain.id) as NetworkId }));
  };

  const onCompound = async () => {
    // if (await checkWrongNetwork()) return;
    dispatch(upgradeNft({ id: nftId, quantity: "0", provider, signer, address, networkID: getValidChainId(chain.id) as NetworkId }));
  };

  const primaryButtonStyle = {
    height: "40px",
    width: "160px",
    borderRadius: "8px",
    background: `${theme.colors.primary[300]}`,
    color: "white",
    fontWeight: "400",
    fontSize: "20px",
  };

  return (
    <>
      <Box
        style={{
          width: "100%",
          display: `${isSmallScreen ? "block" : "flex"}`,
          borderRadius: "8px",
          border: `1px solid ${theme.colors.text}`,
          padding: "8px",
          textAlign: "center",
        }}
      >
        {nftImg ? (
          <NavLink
            // onClick={() => handleOpen(nftId)}
            to={`/nftitem?id=${nftId}`}
            // mt={2}
            // style={{ color: `${theme.colors.text}`, textDecoration: "underline" }}
          >
            <img
              src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(nftImg)))}`}
              width={`${isSmallScreen ? "90%" : "100%"}`}
              // onClick={() => handleOpen(nftId)}
              style={{ cursor: "pointer" }}
            />
          </NavLink>
        ) : (
          <img src={LoadingIcon} width={150} height={150} style={{ marginTop: "100px", marginBottom: "80px" }} />
        )}
        <Box
          ml={2}
          style={{
            textAlign: "center",
            width: `${isSmallScreen ? "90%" : "60%"}`,
            margin: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {isOwned && (
            <>
              <Typography fontSize={16} mt={1}>
                Total Locked Amount
              </Typography>
              <Typography fontSize={20} fontWeight={600}>
                {new Intl.NumberFormat("en-US").format(totalStaked)} $MILK
              </Typography>
            </>
          )}
          {!isOwned && (
            <>
              <Typography fontSize={16} mt={2}>
                Your Staked Amount
              </Typography>
              <Typography fontSize={20} fontWeight={600}>
                {new Intl.NumberFormat("en-US").format(stakedAmount)} $MILK
              </Typography>
            </>
          )}
          <Typography fontSize={16} mt={2}>
            Your Pending Reward
          </Typography>
          <Typography fontSize={20} fontWeight={600}>
            {new Intl.NumberFormat("en-US").format(pendingReward + ownerReward)} $MILK
          </Typography>
          <Box mt={2} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <Typography fontWeight={400} fontSize={14}>
              Receive By ETH
            </Typography>
            <Switch onChange={handleIsSwapChange} checked={isSwap} />
          </Box>
          <Box textAlign={"center"}>
            <Button sx={primaryButtonStyle} onClick={() => onClaim(isSwap)}>
              Claim
            </Button>
            {!isOwned && (
              <Button sx={primaryButtonStyle} style={{ marginTop: "8px" }} onClick={onCompound}>
                Compound
              </Button>
            )}
          </Box>
          <NavLink
            // onClick={() => handleOpen(nftId)}
            to={`/nftitem?id=${nftId}`}
            // mt={2}
            style={{ color: `${theme.colors.text}`, textDecoration: "underline" }}
          >
            View More
          </NavLink>
        </Box>
      </Box>
    </>
  );
}

export default NftCard;
