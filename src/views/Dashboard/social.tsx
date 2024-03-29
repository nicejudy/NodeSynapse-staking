import { Link } from "@mui/material";
import TwitterIcon from "src/assets/icons/twitter.png";
import TelegramIcon from "src/assets/icons/telegram.png";
import WebsiteIcon from "src/assets/icons/website.png";

export default function Social() {
    return (
        <div className="social-row">
            <div style={{ margin: "0 20px" }}>
                <Link href="https://x.com/NodeSynapse" target="_blank">
                    <img src={TwitterIcon} alt="Twitter" width="30px" />
                </Link>
            </div>
            <div style={{ margin: "0 20px" }}>
                <Link href="https://t.me/NodeSynapse" target="_blank">
                    <img src={TelegramIcon} alt="Telegram" width="30px" />
                </Link>
            </div>
            <div style={{ margin: "0 20px" }}>
                <Link href="https://nodesynapse.app" target="_blank">
                    <img src={WebsiteIcon} alt="Website" width="30px" />
                </Link>
            </div>
        </div>
    );
}
