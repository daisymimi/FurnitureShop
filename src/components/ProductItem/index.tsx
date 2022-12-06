import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Item } from "src/types";

export const ProductItem = ({
  id,
  name,
  description,
  image,
  price,
  quantity,
  onClick,
}: Item & { onClick: () => void }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={() => onClick()}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {id.toString()}. {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>
              {price && `Price: ${price.toString()}`} {price && quantity && "|"}{" "}
              {quantity && `Quantity: ${quantity.toString()}`}
            </strong>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductItem;
