import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Stack
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">

      <CardMedia
        component="img"
        alt="green iguana"
        image={product.image}
        height="140"
      
      />
           
      <CardContent>

        <Stack spacing={1.5}>

          <Typography varaint="h6" component="div">{product.name}</Typography>
          <Typography varaint="h5" component="div" sx={{ fontWeight: 'bold' }}> ${product.cost}</Typography>
          <Rating name="read-only" value={product.rating} precision={0.5} readOnly/>
      
        </Stack>
        
      </CardContent>

      <CardActions>
        <Button variant="contained" onClick={handleAddToCart} startIcon={<AddShoppingCartOutlined size="large" />} fullWidth>
          ADD TO CART
        </Button>
      </CardActions>


    </Card>
  );
};

export default ProductCard;
