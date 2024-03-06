import { Box, Button, Fade, Skeleton, Switch, Typography, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { WalletBalance } from "@olympusdao/component-library";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PendingTxName from "src/components/PendingTxName";
import { getValidChainId } from "src/constants/data";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useAppSelector } from "src/hooks";
// import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { claimAll, compoundAll } from "src/slices/NftThunk";
import { useAccount, useNetwork, useSigner } from "wagmi";

const PREFIX = "AssetsIndex";

const classes = {
  selector: `${PREFIX}-selector`,
  forecast: `${PREFIX}-forecast`,
  faucet: `${PREFIX}-faucet`,
};

const StyledFade = styled(Fade)(({ theme }) => ({
  [`& .${classes.selector}`]: {
    "& p": {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "24px",

      cursor: "pointer",
    },
    "& a": {
      color: theme.colors.gray[90],
      marginRight: "18px",
    },
    "& a:last-child": {
      marginRight: 0,
    },
    "& .active": {
      color: theme.palette.mode === "light" ? theme.palette.primary.main : theme.colors.primary[300],
      textDecoration: "inherit",
    },
  },

  [`& .${classes.forecast}`]: {
    textAlign: "right",
    "& .number": {
      fontWeight: 400,
    },
    "& .numberSmall": {
      justifyContent: "flex-end",
    },
  },

  [`& .${classes.faucet}`]: {
    width: "30%",
  },
}));

/**
 * Component for Displaying Assets
 */

export interface OHMAssetsProps {
  path?: string;
}
const AssetsIndex: FC<OHMAssetsProps> = (props: { path?: string }) => {
  const navigate = useNavigate();
  const networks = useTestableNetworks();
  const { chain = { id: 8453 } } = useNetwork();
  const { address = "", isConnected, isReconnecting } = useAccount();

  const theme = useTheme();
  const provider = Providers.getStaticProvider(getValidChainId(chain.id) as NetworkId);
  const { data: signer } = useSigner();
  // const faucetMutation = useFaucet();
  // const isFaucetLoading = faucetMutation.isLoading;
  const milkBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.milk;
  });
  const milkPrice = useAppSelector(state => {
    return Number(state.app.milkPrice);
  });
  const totalLockedAmount = useAppSelector(state => {
    return state.account.totalLockedAmount;
  });
  const totalPendingReward = useAppSelector(state => {
    return state.account.totalPendingReward;
  });
  const totalOwnerReward = useAppSelector(state => {
    return state.account.totalOwnerReward;
  });
  const dispatch = useDispatch();
  const [isSwap, setIsSwap] = useState(false);

  const onClaimAll = async (swapping: boolean) => {
    // if (await checkWrongNetwork()) return;
    dispatch(claimAll({ swapping, provider, signer, address, networkID: getValidChainId(chain.id) as NetworkId }));
  };

  const onCompoundAll = async () => {
    // if (await checkWrongNetwork()) return;
    dispatch(compoundAll({ provider, signer, address, networkID: getValidChainId(chain.id) as NetworkId }));
  };

  const handleIsSwapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSwap(event.target.checked);
  };

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const primaryButtonStyle = {
    height: "50px",
    width: "180px",
    borderRadius: "8px",
    background: `${theme.colors.primary[300]}`,
    color: "white",
    fontWeight: "400",
    fontSize: "20px",
  };
  const isSmallScreen = useMediaQuery("(max-width: 400px)");

  return (
    <StyledFade in={true}>
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <WalletBalance
            title="Balance"
            usdBalance={`$ ${new Intl.NumberFormat("en-US").format(parseFloat(milkBalance * milkPrice))}`}
            underlyingBalance={`${new Intl.NumberFormat("en-US").format(parseFloat(milkBalance))} $MILK`}
          />
        </Box>
        <Box
          display={`${isSmallScreen ? "block" : "flex"}`}
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography fontSize={18}>Total Staked Amount</Typography>
          {totalLockedAmount || totalLockedAmount == 0 ? (
            <Box>
              <Typography fontSize={24} fontWeight={700}>
                {new Intl.NumberFormat("en-US").format(totalLockedAmount)} $MILK
              </Typography>
              <Typography fontSize={14} fontWeight={500} align={`${isSmallScreen ? "left" : "right"}`}>
                ( $ {new Intl.NumberFormat("en-US").format(totalLockedAmount * milkPrice)} )
              </Typography>
            </Box>
          ) : (
            <Skeleton width={80} />
          )}
        </Box>
        <Box
          display={`${isSmallScreen ? "block" : "flex"}`}
          mt={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography fontSize={18}>Total Pending Reward</Typography>
          {totalPendingReward || totalPendingReward == 0 ? (
            <Box>
              <Typography fontSize={24} fontWeight={700}>
                {new Intl.NumberFormat("en-US").format(totalPendingReward + totalOwnerReward)} $MILK
              </Typography>
              <Typography fontSize={14} fontWeight={500} align={`${isSmallScreen ? "left" : "right"}`}>
                ( $ {new Intl.NumberFormat("en-US").format((totalPendingReward + totalOwnerReward) * milkPrice)} )
              </Typography>
            </Box>
          ) : (
            <Skeleton width={80} />
          )}
        </Box>
        <Box
          mt={3}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: `${isSmallScreen ? "flex-start" : "flex-end"}`,
          }}
        >
          <Typography fontWeight={400} fontSize={18}>
            Receive By ETH
          </Typography>
          <Switch onChange={handleIsSwapChange} checked={isSwap} />
        </Box>
        <Box display={`${isSmallScreen ? "block" : "flex"}`} justifyContent={"space-between"} textAlign={"center"}>
          <Button
            sx={primaryButtonStyle}
            onClick={onCompoundAll}
            disabled={totalPendingReward == 0 || pendingTransactions.length > 0}
          >
            <PendingTxName name="Compound All" />
          </Button>
          <Button
            sx={primaryButtonStyle}
            onClick={() => onClaimAll(isSwap)}
            disabled={(totalPendingReward == 0 && totalOwnerReward == 0) || pendingTransactions.length > 0}
            style={{ marginTop: `${isSmallScreen ? "16px" : "0px"}` }}
          >
            <PendingTxName name="Claim All" />
          </Button>
        </Box>
      </Box>
    </StyledFade>
  );
};

export default AssetsIndex;
