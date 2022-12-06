import { Contract } from "ethers";
import { Item } from "src/types";

export const getAllItems = async (shopContract: Contract) => {
  const items = (await shopContract?.getAllItems()) as Item[];
  return items;
};

export const getAllPurchasedItems = async (
  shopContract: Contract,
  address: string
) => {
  const items = (await shopContract?.getAllPurchasedItems(address)) as Item[];
  return items;
};

export const getItem = async (shopContract: Contract, id: number) => {
  const item = (await shopContract?.getItem(id)) as Item;
  return item;
};

export const getOwner = async (shopContract: Contract): Promise<string> => {
  const owner = await shopContract?.owner();
  console.log("owner", owner);
  return owner;
};

export const getRole = async (shopContract: Contract, address: string) => {
  const role = await shopContract?.getRole(address);
  return role;
};
