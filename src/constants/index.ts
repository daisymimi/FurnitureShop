export const MAINNET = 1;
export const SEPOLIA = 11155111;

export enum ChainId {
  MAINNET = "ethMainnet",
  RINKEBY = "rinkeby",
  SEPOLIA = "sepolia",
}

export const getChainId = (): number => {
  return parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111", 10);
};

export const COMMON = 0;
export const ROLE_ADMIN = 1;
export const ROLE_EDITOR = 2;
