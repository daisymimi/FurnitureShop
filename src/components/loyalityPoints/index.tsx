import { Button } from "@mui/material";
import { BigNumber } from "ethers";
import React, { useState, useEffect } from "react";
import useActiveWeb3React from "src/hooks/useActiveWeb3React";
import { getShopContract } from "src/hooks/useContracts";

export default function Loyality() {
  const [points, setPoints] = useState(0);
  const shopContract = getShopContract();
  const { account, active } = useActiveWeb3React();

  useEffect(() => {
    if (active) {
      shopContract.loyality_points(account).then((res: BigNumber) => {
        setPoints(res.toNumber());
      });
    }
  }, [account, active, shopContract]);

  return (
    <div>
      {points > 0 && (
        <Button sx={{ margin: 1 }} variant="contained">
          Loyality Points: {points}
        </Button>
      )}
    </div>
  );
}
