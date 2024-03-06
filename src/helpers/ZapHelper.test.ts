import { NetworkId } from "src/constants";
import { isSupportedChain } from "src/helpers/ZapHelper";
import { describe, expect, it } from "vitest";

describe("isSupportedChain", () => {
  it("should return true for supported chains", () => {
    expect(isSupportedChain(1)).toEqual(true);
    expect(isSupportedChain(5)).toEqual(false);
  });

  it("should return false for unsupported chains", () => {
    const unsupportedChains = [NetworkId.ARBITRUM];
    unsupportedChains.forEach(chainId => {
      expect(isSupportedChain(chainId as NetworkId)).toBe(false);
    });
  });
});
