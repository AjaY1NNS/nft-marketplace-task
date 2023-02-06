import { BigNumber } from "ethers";

export function expandToDecimals(n: number, decimal: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(decimal));
}
