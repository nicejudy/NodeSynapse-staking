import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, ReactElement } from "react";

export interface OHMPageTitleProps {
  name?: string | ReactElement;
}

/**
 * Component for Displaying PageTitle
 */
const PageTitle: FC<OHMPageTitleProps> = ({ name }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      width="100%"
      marginTop="16px"
      marginBottom="32px"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignContent="center"
      
      // marginLeft={mobile ? "9px" : "8px"}
    >
      <Typography fontSize={45} fontWeight={800} lineHeight={"36px"}>{name}</Typography>
      {/* {name === "Mint" && <Typography fontWeight={600} fontSize={24} lineHeight={"44px"}>&nbsp;(Starts in)</Typography>} */}
    </Box>
  );
};

export default PageTitle;
