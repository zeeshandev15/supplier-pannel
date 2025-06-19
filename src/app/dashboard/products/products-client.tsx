'use client';

import * as React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Product } from '@/redux/slices/productSlice';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { toast } from 'react-toastify';

import { deleteProduct, fetchProducts } from '@/lib/api/auth/productsApi';
import AddItemForm from '@/components/dashboard/products/new-product';
import { ProductsCard } from '@/components/dashboard/products/products-card';
import { ProductsFilters } from '@/components/dashboard/products/products-filters';

export default function ProductsPage(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [editproduct, setEditProduct] = React.useState<Product | null>(null);
  const { products } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  let filteredProducts: Product[] = [];

  if (Array.isArray(products)) {
    filteredProducts = products?.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const fetchData = React.useCallback(async (): Promise<void> => {
    try {
      await dispatch(fetchProducts());
    } catch (err: any) {
      toast.error(err.message);
    }
  }, [dispatch]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    try {
      const actionResult = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(actionResult)) {
        fetchData();
        toast.success('Product Delete Successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (err: any) {
      toast.error('Something went wrong: Delete product');
    }
  };
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Products</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <AddItemForm fetchData={fetchData} editproduct={editproduct} />
        </div>
      </Stack>

      <ProductsFilters onSearch={setSearchQuery} />

      <Grid container spacing={3}>
        {filteredProducts?.length > 0 ? (
          filteredProducts?.map((prod) => (
            <Grid key={prod._id} lg={4} md={6} xs={12}>
              <ProductsCard prod={prod} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                <Button variant="outlined" color="primary" onClick={() => setEditProduct(prod)}>
                  Update
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(prod._id)}>
                  Delete
                </Button>
              </Box>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
            No products found.
          </Typography>
        )}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box>
    </Stack>
  );
}
