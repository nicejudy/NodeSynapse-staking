import { Box, Grid, Link, Typography, useMediaQuery, useTheme } from "@mui/material";
import LogoWithText from "src/assets/logo-text.png";
import { BUY_LINK, MILK_ADDRESSES } from "src/constants/addresses";
import { getValidChainId } from "src/constants/data";
import { useNetwork } from "wagmi";

const PREFIX = "TopBar";

const classes = {
  appBar: `${PREFIX}-appBar`,
  menuButton: `${PREFIX}-menuButton`,
  pageTitle: `${PREFIX}-pageTitle`,
  gray: `${PREFIX}-pageTitle`,
};

function Footer() {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1048));
  const { chain = { id: 8453 } } = useNetwork();
  const buyLink =
    BUY_LINK[getValidChainId(chain.id) as keyof typeof BUY_LINK] +
    MILK_ADDRESSES[getValidChainId(chain.id) as keyof typeof MILK_ADDRESSES];
  return (
    <Box width="100%" position="relative" zIndex="1">
      <Box width="100%" position="relative" display="flex" justifyContent="center" paddingTop="100px">
        <Grid
          padding="0px 20px"
          justifyContent="center"
          width="100%"
          maxWidth="1200px"
          gridTemplateColumns="repeat(12, 1fr)"
          container
        >
          <Grid item columnGap={"24px"} marginBottom={"24px"} sm={6} xs={12} md={3}>
            <Box display={"flex"} flexDirection="column" alignItems="center" rowGap="16px">
              <Box fontSize="22px" lineHeight="24px" fontWeight={700}>
                Community
              </Box>
              <Link
                href="https://twitter.com/UnicowNFT"
                target="_blank"
                rel="noopener noreferrer"
                className="link-text"
              >
                Twitter
              </Link>
              <Link
                href="https://discord.gg/PTcNcm52Aq"
                target="_blank"
                rel="noopener noreferrer"
                className="link-text"
              >
                Discord
              </Link>
              <Link href="https://t.me/unicow_finance" target="_blank" rel="noopener noreferrer" className="link-text">
                Telegram
              </Link>
              <Link
                href="https://tiktok.com/@unicownft"
                target="_blank"
                rel="noopener noreferrer"
                className="link-text"
              >
                TikTok
              </Link>
            </Box>
          </Grid>
          <Grid item columnGap={"24px"} marginBottom={"24px"} sm={6} xs={12} md={3}>
            <Box display={"flex"} flexDirection="column" alignItems="center" rowGap="16px">
              <Box fontSize="22px" lineHeight="24px" fontWeight={700}>
                Marketplace
              </Box>
              <Link
                href="https://opensea.io/collection/unicownft"
                target="_blank"
                rel="noopener noreferrer"
                className="link-text"
              >
                Opensea
              </Link>
              <Link href="#" target="" rel="noopener noreferrer" className="link-text">
                Rarible
              </Link>
            </Box>
          </Grid>
          <Grid item columnGap={"24px"} marginBottom={"24px"} sm={6} xs={12} md={3}>
            <Box display={"flex"} flexDirection="column" alignItems="center" rowGap="16px">
              <Box fontSize="22px" lineHeight="24px" fontWeight={700}>
                Resources
              </Box>
              <Link href="https://docs.unicow.org/" target="_blank" rel="noopener noreferrer" className="link-text">
                Docs
              </Link>
              <Link href="#" target="" rel="noopener noreferrer" className="link-text">
                Github
              </Link>
              <Link href="http://medium.com/@UnicowNFT" target="_blank" rel="noopener noreferrer" className="link-text">
                Medium
              </Link>
            </Box>
          </Grid>
          <Grid item columnGap={"24px"} marginBottom={"24px"} sm={6} xs={12} md={3}>
            <Box display={"flex"} flexDirection="column" alignItems="center" rowGap="16px">
              <Box fontSize="22px" lineHeight="24px" fontWeight={700}>
                Buy
              </Box>
              <Link href="/mint" target="" rel="noopener noreferrer" className="link-text">
                Buy NFT
              </Link>
              <Link href={buyLink} target="" rel="noopener noreferrer" className="link-text">
                Buy $MILK
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} sm={12} mt={2}>
            <Box display={"flex"} flexDirection="column" alignItems="center" rowGap="16px">
              <img src={LogoWithText} />
            </Box>
          </Grid>
          <Grid item xs={12} md={12} sm={12} m={"24px"}>
            <Box display={"flex"} flexDirection="column" alignItems="center" rowGap="16px">
              <Typography>UNICOW@2023</Typography>
            </Box>
          </Grid>
        </Grid>
        {/* <Box
            display="flex"
            flexWrap="wrap"
            marginTop="40px"
            alignItems="center"
            gridColumn="2 / 2"
            gap="12px"
            gridRow="1"
          >
            <ReactLink to="/">
              <SvgIcon
                color="primary"
                viewBox="0 0 490 490"
                component={UnicowIcon}
                style={{ minWidth: "61px", minHeight: "61px", width: "61px" }}
              />
            </ReactLink>
            UNICOW
          </Box>
          <Grid
            display="flex"
            justifyContent="center"
            marginTop="10px"
            gridRow="1"
            gap="24px 30px"
            gridColumn="2 / 2"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Icon name="twitter" className={classes.gray} />
            </Link>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Icon name="discord" className={classes.gray} />
            </Link>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Icon name="medium" className={classes.gray} />
            </Link>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Icon name="github" className={classes.gray} />
            </Link>
          </Grid> */}
        {/* <Box fontSize="15px" lineHeight="22px" display="flex" flexWrap="wrap" alignItems="center" marginTop="55px" marginBottom="20px" gridColumn="1 / 5" gap="12px">
                    as;fdlj asd;fljasd;lfkjas;dflkaj
                    <Box display="flex" gap="20px" alignItems="center" marginTop="25px" marginBottom="20px">
                        
                    </Box>
                </Box> */}
        {/* </Grid> */}
      </Box>
    </Box>
  );
}

export default Footer;
