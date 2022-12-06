import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useShopContract } from "src/hooks/useContracts";
import { Item } from "src/types";
import { getItem } from "src/utils/contracts/shop";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";
import useActiveWeb3React from "src/hooks/useActiveWeb3React";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const shopContract = useShopContract();
  const { active } = useActiveWeb3React();
  useEffect(() => {
    if (shopContract && product === null) {
      getItem(shopContract, parseInt(id as string, 10)).then((item) =>
        setProduct(item)
      );
    }
  }, [shopContract, product, id]);

  if (product === null || shopContract === null) {
    return <div>Loading...</div>;
  }

  const buy = () => {
    const promise = shopContract.purchaseItems(
      parseInt(id as string, 10),
      quantity,
      {
        value: product.price.toNumber() * quantity,
      }
    );

    toast.promise(promise, {
      pending: "Buying...",
      success: "Bought",
      error: "Error",
    });

    promise.catch((e: any) => console.error(e));
  };

  return (
    <div>
      <h1>Product</h1>
      <div>
        <strong>ID:</strong> {product.id.toString()}
        <br />
        <strong>Name:</strong> {product.name}
        <br />
        <strong>Description:</strong> {product.description}
        <br />
        <strong>Price:</strong> {product.price.toString()}
        <br />
        <strong>Quantity:</strong> {product.quantity.toString()}
        <br />
        <strong>Royality Point per Purchase:</strong>{" "}
        {product.points.toString()}
        <br />
        <img src={product.image} alt={product.name} width={300} height={300} />
      </div>

      <Button variant="contained" onClick={() => buy()}>
        Buy
      </Button>
      <TextField
        id="filled-number"
        label="Quantity"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="filled"
        defaultValue={1}
        fullWidth
        required
        onChange={(e: any) => setQuantity(parseInt(e.target.value, 10))}
      />
    </div>
  );
}
