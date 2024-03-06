// import { useSelector } from "react-redux";
// import { IReduxState } from "src/store/slices/state.interface";
// import { IAccountSlice } from "src/store/slices/account-slice";
import "src/components/UCowCard/ucowcard.scss";

import { useTheme } from "@mui/material";
import LoadingIcon from "src/assets/icons/loading.gif";
import OpenseaIcon from "src/assets/icons/opensea.png";
import OwnerBadge from "src/assets/icons/owner-badge.png";
import { NFT_MANAGER } from "src/constants/addresses";
import { OPENSEA_ITEM_URL, getValidChainId } from "src/constants/data";
import { generateImage } from "src/helpers/NFTInfo/generateImage";
import { useAccount, useNetwork } from "wagmi";

interface IUCowCardProps {
  nftId: string;
  totalStaked: string;
  totalStakers: string;
  owner: string;
  level: string;
  handleOpen: (a: string) => void;
}

function UCowCard({ nftId, totalStaked, totalStakers, owner, level, handleOpen }: IUCowCardProps) {
  const theme = useTheme();
  // const [nftImg, setNftImg] = useState("");
  const { address = "", isConnected, isReconnecting } = useAccount();
  const { chain = { id: 8453 } } = useNetwork();

  const nftImg = generateImage({
    tokenId: parseInt(nftId),
    level: parseInt(level),
    lockers: parseInt(totalStakers),
    tvl: parseInt(totalStaked),
    ownerAddress: owner,
  });

  return (
    <>
      <div className="ucow-card" style={{ border: `3px solid ${theme.colors.primary[300]}` }}>
        {address == owner && (
          <div className="owner-badge">
            <a
              href={`${OPENSEA_ITEM_URL}${NFT_MANAGER[getValidChainId(chain.id) as keyof typeof NFT_MANAGER]}/${nftId}`}
              target="_blank"
            >
              <img width="55" src={OwnerBadge} />
            </a>
          </div>
        )}
        <div className="opensea-badge">
          <a href={`${OPENSEA_ITEM_URL}${NFT_MANAGER[getValidChainId(chain.id) as keyof typeof NFT_MANAGER]}/${nftId}`} target="_blank">
            <img width="55" src={OpenseaIcon} />
          </a>
        </div>
        <div className="card-image" onClick={() => handleOpen(nftId)}>
          {nftImg ? (
            <img src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(nftImg)))}`} className="nft-image" />
          ) : (
            <img src={LoadingIcon} width={200} height={200} style={{ marginTop: "100px", marginBottom: "80px" }} />
          )}
        </div>
      </div>
    </>
  );
}

export default UCowCard;
