import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import ProductItem from "src/components/ProductItem";
import { getShopContract } from "src/hooks/useContracts";
import { Item } from "src/types";
import { getAllPurchasedItems, getItem } from "src/utils/contracts/shop";
import { toast } from "react-toastify";
import useActiveWeb3React from "src/hooks/useActiveWeb3React";

export default function Products() {
  const router = useRouter();
  const [items, setItems] = React.useState<Item[]>([]);
  const [fetched, setFetched] = React.useState(false);
  const shopContract = getShopContract();

  const { account, active, error } = useActiveWeb3React();

  useEffect(() => {
    if (shopContract && account && !fetched && items.length === 0) {
      var itemsobj = {} as any;
      const promise = getAllPurchasedItems(shopContract, account).then(
        (pitems) => {
          const promises = pitems.map((pitem) =>
            getItem(shopContract, pitem.id.toNumber()).then((item) => {
              return { ...item, quantity: pitem.quantity, price: null };
            })
          );
          Promise.all(promises).then((items) => {
            items.forEach((item) => {
              if (item.id.toString() in itemsobj) {
                itemsobj[item.id.toString()].quantity = itemsobj[
                  item.id.toString()
                ].quantity.add(item.quantity);
              } else itemsobj[item.id.toString()] = item;
            });
            setItems(Object.values(itemsobj));
          });
        }
      );
      toast.promise(promise, {
        pending: "Loading Products...",
        success: "Loaded",
        error: "Error",
      });
      setFetched(true);
    }
  }, [shopContract, items, account, fetched]);

  if (!active) {
    return <div>Connect to wallet</div>;
  }

  if (!shopContract) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <Grid
        container
        spacing={{ xs: 3, md: 3 }}
        columns={{ xs: 8, sm: 8, md: 12 }}
        minWidth="100vh"
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
    </div>
  );
}
