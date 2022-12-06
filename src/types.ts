import { BigNumber } from "ethers";

export interface Item {
  id: BigNumber;
  price: BigNumber;
  quantity: BigNumber;
  points: BigNumber;
  name: string;
  description: string;
  image: string;
}
