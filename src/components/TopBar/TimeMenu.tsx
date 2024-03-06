import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@mui/material";
import "./time-menu.scss";
import TimeImg from "src/assets/icons/logo.png";
import { DEFAULD_NETWORK } from "src/constants/tokens";
import { useAppSelector } from "src/hooks";
import { NS_ADDRESS } from "src/constants/addresses";
// import { IReduxState } from "../../../store/slices/state.interface";
// import { getTokenUrl } from "../../../helpers";

function toUrl(tokenPath: string): string {
  const host = window.location.origin;
  return `${host}/${tokenPath}`;
}

function getTokenUrl(name: string) {
  if (name === "ns") {
      return toUrl(TimeImg);
  }

  throw Error(`Token url doesn't support: ${name}`);
}

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
    const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());

    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: 9,
                        image: tokenImage,
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
};

function TimeMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const isEthereumAPIAvailable = window.ethereum;

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="time-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
            <div className="time-menu-btn">
                NS
            </div>

            <Popper className="time-menu-popper" open={open} anchorEl={anchorEl} transition>
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={200}>
                        <div className="tooltip">
                            <Link className="tooltip-item" href={`https://app.uniswap.org/swap?inputCurrency=ETH&outputCurrency=${NS_ADDRESS[1]}`} target="_blank">
                                <p>Buy on Uniswap</p>
                            </Link>

                            {isEthereumAPIAvailable && (
                                <div className="add-tokens">
                                    <div className="divider" />
                                    <div className="tooltip-item" onClick={addTokenToWallet("NS", NS_ADDRESS[1])}>
                                        <p>Add NS to Wallet</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}

export default TimeMenu;
