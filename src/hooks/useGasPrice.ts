import { getChainId, MAINNET } from "src/constants";
import { GAS_PRICE_GWEI } from "src/constants/gasPrice";

export function useGasPrice(): string {
  const chainId = getChainId();
  return chainId === MAINNET ? GAS_PRICE_GWEI.default : GAS_PRICE_GWEI.testnet;
}
