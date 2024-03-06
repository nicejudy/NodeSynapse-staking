// import "src/components/TopBar/TopBar.scss";

import { CloseOutlined } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, SvgIcon, Typography, useMediaQuery, useTheme, Popper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, NavItem } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Link, Link as ReactLink, useLocation } from "react-router-dom";
import { ReactComponent as MenuIcon } from "src/assets/icons/hamburger.svg";
import { ReactComponent as UnicowIcon } from "src/assets/icons/unicow.svg";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { ConnectButton } from "src/components/ConnectButton/ConnectButton";
import ThemeSwitcher from "src/components/TopBar/ThemeSwitch";
import { NetworkId } from "src/networkDetails";
import { useAccount, useNetwork } from "wagmi";
import TimeMenu from "./TimeMenu";
import TimeImg from "src/assets/icons/logo.png";

const PREFIX = "TopBar";

const classes = {
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
  pageTitle: `${PREFIX}-pageTitle`,
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`&.${classes.appBar}`]: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
      paddingTop: "22.5px",
    },
    backdropFilter: "none",
  },

  [`& .${classes.menuButton}`]: {
    [theme.breakpoints.up(1048)]: {
      display: "none",
    },
  },

  [`& .${classes.pageTitle}`]: {
    [theme.breakpoints.up(1048)]: {
      marginLeft: "287px",
    },
    marginLeft: "0px",
  },
}));

interface TopBarProps {
  colorTheme: string;
  toggleTheme: (e: KeyboardEvent) => void;
  handleDrawerToggle: () => void;
}

function TopBar({ colorTheme, toggleTheme, handleDrawerToggle }: TopBarProps) {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1048));
  const { chain = { id: 8453 } } = useNetwork();
  const { address = "", isConnected, isReconnecting } = useAccount();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  return (
    <Box maxWidth="1200px" margin="auto" width="100%">
      <Box display="flex" justifyContent="space-between">
        <Box paddingTop="8px" marginLeft={desktop ? "33px" : "0px"} display={"flex"} alignItems={"center"}>
          <ReactLink to="/">
            <img src={TimeImg} alt="logo" width="64px" />
          </ReactLink>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          paddingTop="8px"
          marginRight={desktop ? "33px" : "0px"}
        >
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center">
              <TimeMenu />
              <ConnectButton />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TopBar;
