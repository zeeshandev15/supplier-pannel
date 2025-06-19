'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhotoCamera } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { ProductDefaultValues, ProductFormValues, productSchema } from '@/lib/(schemas)/productSchema';
import { createProduct, updateProducts } from '@/lib/api/auth/productsApi';

interface AddItemFormProps {
  fetchData: () => void;
  editproduct: any;
}

export default function AddItemForm({ fetchData, editproduct }: AddItemFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: ProductDefaultValues,
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (editproduct) {
      setOpen(true);
      const keys = ['title', 'description', 'price', 'image'] as const;
      keys.forEach((key) => {
        setValue(key, editproduct[key] || '');
      });

      if (editproduct.date) {
        setValue('date', editproduct.date?.split('T')[0] || new Date().toISOString().split('T')[0]);
      }
      if (editproduct.image) {
        setPreview(`http://localhost:8001/${editproduct.image}`);
      }
    }
  }, [editproduct, setValue]);

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    (Object.keys(data) as (keyof ProductFormValues)[]).forEach((key) => {
      if (key !== 'image') {
        formData.append(key, data[key]);
      }
    });
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    try {
      if (editproduct) {
        const actionResult = await dispatch(updateProducts({ id: editproduct._id, data: formData }));
        if (updateProducts.fulfilled.match(actionResult)) {
          toast.success('Product Update Successfully');
          fetchData();

          if (actionResult.payload.product?.image) {
            setPreview(`http://localhost:8001/${actionResult.payload.product.image}`);
          }
          reset();
          setOpen(false);
        } else {
          toast.error('Failed to update product');
        }
      } else {
        const resultAction = await dispatch(createProduct(formData));
        if (createProduct.fulfilled.match(resultAction)) {
          toast.success(resultAction.payload.message);
          setOpen(false);
          fetchData();
        } else {
          toast.error(resultAction.payload as string) || 'Something went wrong';
        }
        reset();
        setOpen(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ backgroundColor: '#6366F1', color: '#fff' }}>
        + Add Item
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2} mt={1}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={preview || '/default-icon.png'} sx={{ width: 80, height: 80 }} />
              <input
                accept="image/*"
                id="upload-image"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              <label htmlFor="upload-image">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
            </Box>

            <TextField
              label="Title"
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
            />
            <TextField
              label="Description"
              {...register('description')}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Price"
              {...register('price')}
              error={!!errors.price}
              helperText={errors.price?.message}
              fullWidth
              multiline
              rows={1}
            />
            <TextField
              label="Updated At"
              type="date"
              {...register('date')}
              error={!!errors.date}
              helperText={errors.date?.message}
              fullWidth
            />

            <DialogActions>
              <Button onClick={() => setOpen(false)} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#6366F1', color: '#fff' }}>
                {editproduct ? 'Update Item' : 'Add Item'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
