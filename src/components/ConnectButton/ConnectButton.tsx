import { Box, SvgIcon, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Icon, OHMButtonProps, PrimaryButton } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useLocation } from "react-router-dom";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { trackGAEvent } from "src/helpers/analytics/trackGAEvent";

const fireAnalyticsEvent = () => {
  trackGAEvent({
    category: "App",
    action: "connect",
  });
};

export const InPageConnectButton = ({
  fullWidth = false,
  size = "medium",
}: {
  fullWidth?: boolean;
  size?: OHMButtonProps["size"];
}) => {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <PrimaryButton
                    fullWidth={fullWidth}
                    onClick={() => {
                      fireAnalyticsEvent();
                      openConnectModal();
                    }}
                    size={size}
                  >
                    <SvgIcon component={WalletIcon} style={{ marginRight: "9px", fill: "none" }} viewBox="0 0  37 34" />
                    Connect Wallet
                  </PrimaryButton>
                );
              }
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};
export const ConnectButton = () => {
  const location = useLocation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                // if (walletDrawerOpen) {
                return mobile ? (
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    sx={{
                      height: "39px",
                      borderRadius: "6px",
                      padding: "9px",
                      cursor: "pointer",
                      border: `1px solid ${theme.colors.text}`,
                      "& path": { stroke: `${theme.colors.text}` },
                      "&:hover": {
                        border: `1px solid ${theme.colors.primary[300]}`,
                        color: theme.colors.primary[300],
                      },
                      "&:hover path": {
                        stroke: theme.colors.primary[300],
                      },
                      // background: theme.colors.paper.card,
                      color: theme.colors.text,
                    }}
                    onClick={() => {
                      // fireAnalyticsEvent();
                      openConnectModal();
                    }}
                  >
                    <SvgIcon component={WalletIcon} style={{ fill: "none" }} viewBox="0 0  37 34" />
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    sx={{
                      height: "39px",
                      borderRadius: "6px",
                      padding: "9px 18px",
                      cursor: "pointer",
                      background: theme.colors.primary[300],
                      // background: theme.colors.paper.card,
                      color: theme.colors.text,
                      "&:hover": { background: theme.colors.primary[100] },
                    }}
                    onClick={() => {
                      // fireAnalyticsEvent();
                      openConnectModal();
                    }}
                  >
                    <SvgIcon component={WalletIcon} style={{ marginRight: "9px", fill: "none" }} viewBox="0 0  37 34" />
                    <Typography fontWeight="500">{`Connect`}</Typography>
                  </Box>
                );
              } else {
                return (
                  <Box display="flex" alignItems="center">
                    {
                      <>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{
                            marginRight: "9px",
                            fontSize: "0.875rem",
                            height: "39px",
                            borderRadius: "6px",
                            padding: `${mobile ? "9px" : "9px 18px"}`,
                            cursor: "pointer",
                            fontWeight: 500,
                            border: `1px solid ${theme.colors.text}`,
                            "& path": { stroke: `${theme.colors.text}` },
                            "&:hover": {
                              border: `1px solid ${theme.colors.primary[300]}`,
                              color: theme.colors.primary[300],
                            },
                            "&:hover path": {
                              stroke: theme.colors.primary[300],
                            },
                          }}
                          onClick={() => {
                            chain.unsupported ? openChainModal() : openAccountModal();
                          }}
                        >
                          <SvgIcon
                            component={WalletIcon}
                            style={{ marginRight: `${mobile ? "0px" : "9px"}`, fill: "none" }}
                            viewBox="0 0  37 34"
                          />
                          {mobile ? "" : chain.unsupported ? "Unsupported Network" : account.displayName}
                        </Box>
                        <Box
                          display="flex"
                          alignItems="center"
                          sx={{
                            height: "39px",
                            borderRadius: "6px",
                            padding: "9px",
                            cursor: "pointer",
                            // background:
                            //   theme.palette.mode === "light" ? theme.colors.paper.card : theme.colors.gray[500],
                            // "&:hover": {
                            //   background:
                            //     theme.palette.mode === "light" ? theme.colors.paper.cardHover : theme.colors.gray[90],
                            // },
                            border: `1px solid ${theme.colors.text}`,
                            "&:hover": {
                              border: `1px solid ${theme.colors.primary[300]}`,
                              color: theme.colors.primary[300],
                            },
                            "&:hover path": {
                              stroke: theme.colors.primary[300],
                            },
                          }}
                          onClick={() => {
                            openChainModal();
                          }}
                        >
                          {chain.unsupported && (
                            <Icon name="alert-circle" style={{ fill: theme.colors.feedback.error }} />
                          )}
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 24,
                                height: 24,
                                borderRadius: 999,
                                overflow: "hidden",
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  style={{ width: 24, height: 24 }}
                                />
                              )}
                            </div>
                          )}
                        </Box>
                      </>
                    }
                  </Box>
                );
              }
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

export default ConnectButton;
