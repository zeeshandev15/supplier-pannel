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

import { CustomerDefaultValues, CustomerFormValues, customerSchema } from '@/lib/(schemas)/customer.schema';
import { createCustomer, updateCustomers } from '@/lib/api/auth/customersApi';

interface AddCustomerFormProps {
  fetchData: () => void;
  editProduct: any;
  setEditProduct: (value: any) => void;
}

export default function AddCustomerForm({ fetchData, editProduct, setEditProduct }: AddCustomerFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: CustomerDefaultValues,
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      setValue('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: CustomerFormValues) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('location', data.location);
    formData.append('phone', data.phone);
    formData.append('email', data.email);
    formData.append('joinedDate', data.joinedDate);
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    try {
      if (editProduct) {
        const result = await dispatch(updateCustomers({ id: editProduct._id, data: formData }));
        if (updateCustomers.fulfilled.match(result)) {
          toast.success('Inventory updated!');
          fetchData();
          reset();
          setPreview(null);
          setEditProduct(null);
          setOpen(false);
        } else {
          toast.error('Failed to update inventory');
        }
      } else {
        const result = await dispatch(createCustomer(formData));
        if (createCustomer.fulfilled.match(result)) {
          toast.success('Inventory created!');
          fetchData();
          reset();
          setPreview(null);
          setOpen(false);
        } else {
          toast.error('Failed to create inventory');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ backgroundColor: '#6366F1', color: '#fff' }}>
        + Add
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editProduct ? 'Update Customer' : 'Add New Customer'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2} mt={1}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={preview || '/default-avatar.png'} sx={{ width: 80, height: 80 }} />
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
              label="Name"
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <TextField
              label="Email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              label="Phone"
              {...register('phone')}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
            />
            <TextField
              label="location"
              {...register('location')}
              error={!!errors.location}
              helperText={errors.location?.message}
              fullWidth
            />
            <TextField
              label="Joined Date"
              type="date"
              {...register('joinedDate')}
              error={!!errors.joinedDate}
              helperText={errors.joinedDate?.message}
              fullWidth
            />

            <DialogActions>
              <Button onClick={() => setOpen(false)} color="error">
                Cancel
              </Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: '#6366F1', color: '#fff' }}>
                {editProduct ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
