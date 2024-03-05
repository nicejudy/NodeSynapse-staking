import { AppBar, Toolbar, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuIcon from "../../assets/icons/hamburger.svg";
import WonderlandIcon from "../../assets/icons/logo.png";
import TimeMenu from "./time-menu";
import ConnectButton from "./connect-button";
import "./header.scss";
import { DRAWER_WIDTH, TRANSITION_DURATION } from "../../constants/style";

interface IHeader {
    handleDrawerToggle: () => void;
    drawe: boolean;
}

const useStyles = makeStyles(theme => ({
    appBar: {
        [theme.breakpoints.up("sm")]: {
            width: "100%",
            padding: "20px 0 30px 0",
        },
        justifyContent: "flex-end",
        alignItems: "flex-end",
        background: "transparent",
        backdropFilter: "none",
        zIndex: 10,
    },
    topBar: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: TRANSITION_DURATION,
        }),
        // marginLeft: DRAWER_WIDTH,
    },
    topBarShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: TRANSITION_DURATION,
        }),
        marginLeft: 0,
    },
}));

function Header({ handleDrawerToggle, drawe }: IHeader) {
    const classes = useStyles();
    const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
    const isWrapShow = useMediaQuery("(max-width: 480px)");

    return (
        <div className={`${classes.topBar} ${!drawe && classes.topBarShift}`}>
            {/* <AppBar className={classes.appBar} elevation={0}> */}
            <Toolbar disableGutters className="dapp-topbar">
                <div className="dapp-topbar-slider-btn">
                    <Link href="https://wonderland.money" target="_blank">
                        <img alt="" src={WonderlandIcon} width="50px" />
                    </Link>
                </div>
                <div className="dapp-topbar-btns-wrap">
                    <TimeMenu />
                    <ConnectButton />
                </div>
            </Toolbar>
            {/* </AppBar> */}
        </div>
    );
}

export default Header;
