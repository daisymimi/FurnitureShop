import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Grid, styled, Paper, Button } from "@mui/material";
import ProductItem from "src/components/ProductItem";
import { getShopContract } from "src/hooks/useContracts";
import { Item } from "src/types";
import { getAllItems } from "src/utils/contracts/shop";
import { toast } from "react-toastify";

export default function Products() {
  const router = useRouter();
  const [items, setItems] = React.useState<Item[]>([]);
  const shopContract = getShopContract();

  useEffect(() => {
    if (shopContract && items.length === 0) {
      const promise = getAllItems(shopContract).then((items) =>
        setItems(items)
      );
      toast.promise(promise, {
        pending: "Loading Products...",
        success: "Loaded",
        error: "Error",
      });
    }
  }, [shopContract, items]);

  if (!shopContract) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {items.map((item) => (
          <Grid item xs={2} sm={4} md={4} key={item.id.toString()}>
            <ProductItem
              {...item}
              onClick={() => {
                router.push(`/products/${item.id}`, undefined, {
                  shallow: true,
                  scroll: true,
                });
              }}
            />
          </Grid>
        ))}
      </Grid>
      {/* add item */}
      <br />
      <Button
        variant="contained"
        onClick={() => {
          router.push("/products/add", undefined, {
            shallow: true,
            scroll: true,
          });
        }}
      >
        Add new products
      </Button>
    </div>
  );
}
