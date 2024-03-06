import "src/components/Sidebar/Sidebar.scss";

import { Telegram } from "@mui/icons-material";
import { Box, Divider, Link, Paper, SvgIcon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, NavItem } from "@olympusdao/component-library";
import React from "react";
import { ReactComponent as UnicowIcon } from "src/assets/icons/unicow.svg";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useNetwork } from "wagmi";

const PREFIX = "NavContent";

const classes = {
  gray: `${PREFIX}-gray`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.gray}`]: {
    color: theme.colors.gray[90],
  },
}));

const NavContent: React.VFC = () => {
  const theme = useTheme();
  const { chain = { id: 8453 } } = useNetwork();
  const networks = useTestableNetworks();

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://unicow.org" target="_blank" rel="noopener noreferrer">
              <SvgIcon
                color="primary"
                viewBox="0 0 490 490"
                component={UnicowIcon}
                style={{ minWidth: "81px", minHeight: "81px", width: "81px" }}
              />
              <Typography fontSize="24px" fontWeight="700" lineHeight="32px">
                UniCow
              </Typography>
            </Link>
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <NavItem to="/dashboard" icon="dashboard" label={`Dashboard`} />
              <NavItem to="/mint" icon="bond" label={`Mint`} />
              <NavItem to="/staking" icon="stake" label={`Staking`} />
              <NavItem to="/referral" icon="grants" label={`Referral`} />
              <NavItem to="/calculator" icon="bridge" label={`Calculator`} />
              <NavItem href="https://docs.unicow.org" target="_blank" icon="docs" label={`Docs`} />

              <Box className="menu-divider">
                <Divider sx={{ borderColor: theme.colors.gray[600] }} />
              </Box>
              {/* <NavItem icon="bridge" label={`Bridge`} to="/bridge" />
              <NavItem icon="transparency" label={`Transparency`} href="https://www.olympusdao.finance/transparency" /> */}
              <Box className="menu-divider">
                <Divider sx={{ borderColor: theme.colors.gray[600] }} />
              </Box>
            </div>
          </div>
        </div>
        <Box>
          {/* <NavItem href="https://forum.olympusdao.finance/" icon="forum" label={`Forum`} />
          <NavItem href="https://docs.olympusdao.finance/" icon="docs" label={`Docs`} />
          <NavItem href="https://immunefi.com/bounty/olympus/" icon="alert-circle" label={`Bug Bounty`} /> */}
          <StyledBox display="flex" justifyContent="space-around" paddingY="24px">
            {/* <Link href="https://github.com/UniCow" target="_blank" rel="noopener noreferrer">
              <Icon name="github" className={classes.gray} />
            </Link> */}

            <Link href="https://t.me/unicow_finance" target="_blank" rel="noopener noreferrer">
              {/* <SvgIcon
                color="primary"
                viewBox="0 0 24 24"
                component={TelegramIcon}
              /> */}
              <Telegram style={{ width: "24px", height: "24px" }} />
            </Link>

            <Link href="https://twitter.com/UnicowNFT" target="_blank" rel="noopener noreferrer">
              <Icon name="twitter" className={classes.gray} style={{ color: `${theme.colors.text}` }} />
            </Link>

            <Link href="https://discord.gg/PTcNcm52Aq" target="_blank" rel="noopener noreferrer">
              <Icon name="discord" className={classes.gray} style={{ color: `${theme.colors.text}` }} />
            </Link>
          </StyledBox>
        </Box>
      </Box>
    </Paper>
  );
};

// const RangePrice = (props: { bidOrAsk: "bid" | "ask" }) => {
//   const { data, isFetched } = DetermineRangeDiscount(props.bidOrAsk);
//   return (
//     <>
//       {isFetched && (
//         <Box ml="26px" mt="12px" mb="12px" mr="18px">
//           <Typography variant="body2" color="textSecondary">
//             {props.bidOrAsk === "bid" ? `Bid` : `Ask`}
//           </Typography>
//           <Box mt="12px">
//             <Box mt="8px">
//               <Link component={NavLink} to={`/range`}>
//                 <Box display="flex" flexDirection="row" justifyContent="space-between">
//                   <Typography variant="body1">{data.quoteToken}</Typography>
//                   <BondDiscount discount={new DecimalBigNumber(data.discount.toString())} />
//                 </Box>
//               </Link>
//             </Box>
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// };

export default NavContent;
