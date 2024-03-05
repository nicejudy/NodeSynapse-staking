import TimeImg from "../assets/icons/logo.png";
import MemoImg from "../assets/tokens/MEMO.png";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "ns") {
        return toUrl(TimeImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
