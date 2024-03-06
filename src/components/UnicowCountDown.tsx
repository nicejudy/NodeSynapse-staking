import { Box, Modal, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { START_TIME } from "src/constants/data";

/**
 * Component for Displaying PageTitle
 */
function UnicowCountDown (props: {setOpen: (v:boolean) => void, open: boolean}) {
//   const theme = useTheme();
//   const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [leftTime, setLeftTime] = useState(0);

  const getOverTime = (time: number) => {
    return time <= 0 ? 0 : time;
  };

  function format2Digit(x: number) {
    return x > 9 ? x.toString() : "0" + x;
  }

  useEffect(() => {
    let timer = setInterval(() => {
      setLeftTime(getOverTime(START_TIME - Math.floor(Date.now() / 1000)));
    }, 1000);
    return () => clearInterval(timer);
  }, [leftTime]);

  let days = "00",
    hours = "00",
    minutes = "00",
    seconds = "00";

  if (leftTime > 0) {
    days = format2Digit(Math.floor(leftTime / 86400));
    hours = format2Digit(Math.floor((leftTime % 86400) / 3600));
    minutes = format2Digit(Math.floor((leftTime % 3600) / 60));
    seconds = format2Digit(Math.floor((leftTime % 3600) % 60));
  }

  const handleOpen = () => props.setOpen(true);
  const handleClose = () => props.setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
};

export default UnicowCountDown;
