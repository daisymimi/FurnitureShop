import { Contract, ethers } from "ethers";
import { simpleRpcProvider } from "src/utils/providers";
import CONTRACTS from "src/constants/contracts";
import shopAbi from "src/constants/abi/shop.json";
import useActiveWeb3React from "./useActiveWeb3React";
import { useMemo } from "react";
import { getChainId, SEPOLIA } from "src/constants";

const getContract = (
  abi: any,
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getAddress = (address: typeof CONTRACTS["shop"]): string => {
  const chainId = getChainId() as keyof typeof CONTRACTS["shop"];
  return address[chainId] ? address[chainId] : address[SEPOLIA];
};

export const getShopContract = (
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(shopAbi, getAddress(CONTRACTS.shop), signer);
};

export function useShopContract(): Contract | null {
  const { library, ...other } = useActiveWeb3React();
  // console.log("library", library);
  // console.log("other", other);
  const signer = library?.getSigner();
  console.log("SIGNER", signer);
  console.log("SIGNER", signer?.getAddress());
  return useMemo(() => getShopContract(library?.getSigner()), [library]);
}
