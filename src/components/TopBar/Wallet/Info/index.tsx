import { Box, Fade, Grid, SvgIcon, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { Link as NavLink, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { ReactComponent as LeftIcon } from "src/assets/icons/left.svg";
import LoadingIcon from "src/assets/icons/loading.gif";
import { ReactComponent as NoNFTIcon } from "src/assets/icons/no-nfts.svg";
import { ReactComponent as RightIcon } from "src/assets/icons/right.svg";
import { ReactComponent as WhiteLogoIcon } from "src/assets/icons/white-logo.svg";
import NftCard from "src/components/TopBar/Wallet/Info/NftCard";
import { useAppSelector } from "src/hooks";

/**
 * Component for displaying info
 */
export const Info: FC = () => (
  <>
    <Routes>
      <Route path="/" element={<InfoContainer />}>
        {/* <Route path="news" element={<News />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="faq" element={<Faq />} /> */}
      </Route>
    </Routes>
  </>
);

const PREFIX = "Info";

const classes = {
  tabNav: `${PREFIX}-tabNav`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  [`& .${classes.tabNav}`]: {
    "& a": {
      fontSize: "14px",
      lineHeight: "20px",
      color: theme.colors.gray[90],
      padding: "8px 18px 10px 18px",
      "&.active": {
        color: theme.palette.mode === "light" ? theme.palette.primary.main : theme.colors.primary[300],
      },
    },
  },
}));

const InfoContainer = () => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isLoading = useAppSelector(state => {
    return state.gallery.loading;
  });
  const ownedNft = useAppSelector(state => {
    return state.account.ownedNfts;
  });
  const stakedNft = useAppSelector(state => {
    return state.account.stakedNfts;
  });

  let nfts;
  let isOwned = false;
  if (pathname.includes("ownednft")) {
    nfts = ownedNft;
    isOwned = true;
  } else if (pathname.includes("stakednft")) {
    nfts = stakedNft;
    isOwned = false;
  }
  const handleOpen = (id: string) => {
    if (typeof window !== "undefined") {
      window.location.href = window.location.origin + "/nftitem?id=" + id;
    }
  };
  return (
    <Root>
      <Fade in>
        <Box display="flex" flexDirection="row" className={classes.tabNav} pt="18px" mb="18px">
          {!isLoading ? (
            <Grid container rowGap={2} alignItems={"center"} justifyContent={"center"}>
              {nfts && nfts.length == 0 ? (
                <Box
                  display={"flex"}
                  mt={4}
                  alignItems={"center"}
                  width={"100%"}
                  justifyContent={"center"}
                  position={"relative"}
                >
                  {/* <Skeleton width="100px" /> */}
                  <SvgIcon component={NoNFTIcon} viewBox="0 0 401 399" style={{ width: "354px", height: "350px" }} />
                  <Box position={"absolute"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <SvgIcon
                      component={WhiteLogoIcon}
                      viewBox="0 0 155 193"
                      style={{ width: "150px", height: "152px" }}
                    />
                    <Typography fontSize={24} fontWeight={800}>
                      You Don't Own Any NFTs.
                    </Typography>
                    <Box display={"flex"} justifyContent={"space-between"} mt={1}>
                      <SvgIcon component={LeftIcon} viewBox="0 0 110 74" style={{ width: "90px", height: "45px" }} />
                      <NavLink
                        style={{
                          height: "50px",
                          width: "200px",
                          borderRadius: "25px",
                          background: `${theme.colors.primary[300]}`,
                          color: "white",
                          fontWeight: "400",
                          fontSize: "18px",
                          textDecoration: "none",
                          textAlign: "center",
                          paddingTop: "15px",
                        }}
                        to="/gallery"
                      >
                        View Gallery
                      </NavLink>
                      <SvgIcon component={RightIcon} viewBox="0 0 110 74" style={{ width: "90px", height: "45px" }} />
                    </Box>
                  </Box>
                </Box>
              ) : (
                nfts &&
                nfts.map(nft => {
                  return (
                    <NftCard
                      nftId={nft.toString()}
                      // level={gallery[nft - 1].level}
                      // totalStakers={gallery[nft - 1].totalStakers}
                      // totalStaked={gallery[nft - 1].totalStakedAmount}
                      // owner={gallery[nft - 1].owner}
                      isOwned={isOwned}
                      // nftLastProcessingTimestamp={gallery[nft - 1].nftLastProcessingTimestamp}
                      // handleOpen={() => handleOpen(nft.toString())}
                    />
                  );
                })
              )}
            </Grid>
          ) : (
            <img src={LoadingIcon} width={150} height={150} style={{ margin: "auto", marginTop: "50px" }} />
          )}
        </Box>
      </Fade>

      <Outlet />
    </Root>
  );
};
