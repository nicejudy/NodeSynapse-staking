import { generateSVG, SVGParams } from "src/helpers/NFTInfo/generateSVG";

export interface ImageParams {
  tokenId: number;
  level: number;
  lockers: number;
  tvl: number;
  ownerAddress: string;
}

export const generateImage = (params: ImageParams) => {
  const level = getLevelAsString(params.level);
  const colors = getColors(params.level);
  const svgParams: SVGParams = {
    ownerAddress: params.ownerAddress.toLowerCase(),
    tokenId: params.tokenId,
    levelAsString: level,
    level: params.level,
    lockers: params.lockers,
    tvl: params.tvl,
    colors: colors,
  };

  return generateSVG(svgParams);
};

const getLevelAsString = (level: number) => {
  if (level == 0) {
    return "COMMON";
  } else if (level == 1) {
    return "GOLD";
  } else if (level == 2) {
    return "PLANTIUM";
  } else if (level == 3) {
    return "DIAMOND";
  } else {
    return "UNKNOWN";
  }
};

const getColors = (level: number) => {
  if (level == 0) {
    return ["c2c2c2", "757575", "646464", "999999", "525252", "8b8b8b", "888888", "464646", "222222", "1d1d1d"];
  } else if (level == 1) {
    return ["ffee00", "d0ff00", "ff2f00", "ffbb00", "d80000", "d46000", "b10000", "8b3800", "361a00", "361a00"];
  } else if (level == 2) {
    return ["3effc5", "26dddd", "26c2ad", "274b5f", "0d4747", "0f5858", "79aabe", "1c7e7e", "27525f", "0f2e33"];
  } else if (level == 3) {
    return ["ec008c", "ff0000", "61000d", "530000", "42080b", "850d21", "740000", "491902", "440808", "160202"];
  } else {
    return ["000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000", "000000"];
  }
};
