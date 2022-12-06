import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useShopContract } from "src/hooks/useContracts";
import useActiveWeb3React from "src/hooks/useActiveWeb3React";
import { getOwner, getRole } from "src/utils/contracts/shop";
import { toast } from "react-toastify";

interface Data {
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  points: number;
}

export default function AddProduct() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [checkedRole, setCheckedRole] = useState(false);

  const [data, setData] = useState<Data>({} as any);

  const { account, active, error } = useActiveWeb3React();
  const shopContract = useShopContract();

  useEffect(() => {
    const f = async () => {
      if (active && shopContract) {
        if (!checkedRole) {
          const owner = await getOwner(shopContract);
          if (owner === account) {
            setIsAllowed(true);
            setCheckedRole(true);
          } else {
            const role = await getRole(shopContract, account as string);
            if (role === 1) {
              setIsAllowed(true);
              setCheckedRole(true);
            }
          }
        }
        setCheckedRole(true);
      }
    };
    f();
  }, [shopContract, account, checkedRole, active]);

  if (!active || error) {
    return <div>Connect to wallet</div>;
  }

  if (!checkedRole || !shopContract) {
    return <div>Loading...</div>;
  }

  if (!isAllowed) {
    return <div>You dont have access allowed</div>;
  }

  const addItem = async (data: Data) => {
    const promise = shopContract.addItem(
      data.price,
      data.quantity,
      data.points,
      data.name,
      data.description,
      data.image
    );
    toast.promise(promise, {
      pending: "Adding item...",
      success: "Item added",
      error: "Error adding item",
    });
  };

  // form

  const handleChange = (key: string, value: string | number) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const validate = () => {
    if (
      data.name &&
      data.description &&
      data.image &&
      data.price &&
      data.quantity &&
      data.points &&
      data.name.length > 0 &&
      data.description.length > 0 &&
      data.image.length > 0 &&
      data.price > 0 &&
      data.quantity >= 0 &&
      data.points >= 0
    ) {
      return true;
    }
  };

  const handleSubmit = () => {
    console.log(data);
    if (validate()) {
      addItem(data);
    } else {
      alert("Please fill all the fields");
    }
  };

  return (
    <>
      <h1>Add Product</h1>

      <Box sx={{ maxWidth: "50vh", paddingLeft: "20vh" }}>
        <TextField
          id="filled-search"
          label="Name"
          type="search"
          variant="filled"
          fullWidth
          required
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <br />
        <br />
        <TextField
          id="filled-search"
          label="Description"
          type="search"
          variant="filled"
          fullWidth
          required
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <br />
        <br />
        <TextField
          id="filled-search"
          label="Image"
          type="search"
          variant="filled"
          fullWidth
          required
          onChange={(e) => handleChange("image", e.target.value)}
        />
        <br />
        <br />
        <TextField
          id="filled-number"
          label="Price"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          fullWidth
          required
          onChange={(e) => handleChange("price", parseInt(e.target.value, 10))}
        />
        <br />
        <br />
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
          onChange={(e) =>
            handleChange("quantity", parseInt(e.target.value, 10))
          }
        />
        <br />
        <br />
        <TextField
          id="filled-number"
          label="Points"
          type="number"
          variant="filled"
          defaultValue={1}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          required
          onChange={(e) => handleChange("points", parseInt(e.target.value, 10))}
        />
        <br />
        <br />

        <Button variant="contained" onClick={() => handleSubmit()}>
          Add Product
        </Button>
      </Box>
    </>
  );
}
