import * as React from 'react';
import { Product } from '@/redux/slices/productSlice';
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';

export interface ProductsCardProps {
  prod: Product;
}

export function ProductsCard({ prod }: ProductsCardProps): React.JSX.Element {
  return (
    <Card sx={{ maxWidth: 420 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="240"
          image={prod.image ? `http://localhost:8001/uploads/${prod.image}` : undefined}
          alt="product image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {prod.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {prod.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {prod.price}
        </Typography>
      </CardActions>
    </Card>
  );
}
