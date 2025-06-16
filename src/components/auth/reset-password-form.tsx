'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { paths } from '@/paths';
import { ResetDefaultValues, ResetFormValues, resetSchema } from '@/lib/(schemas)/auth.schema';
import { resetPassword } from '@/lib/api/auth/authApi';

export function ResetPassword(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetFormValues>({ defaultValues: ResetDefaultValues, resolver: zodResolver(resetSchema) });

  const onSubmit = React.useCallback(
    async (values: ResetFormValues): Promise<void> => {
      console.log('🚀 ~ values:', values);
      try {
        const resultAction = await dispatch(resetPassword(values));
        if (resetPassword.fulfilled.match(resultAction)) {
          toast.success(resultAction.payload.message);
          reset();
          router.push(paths.auth.signIn);
        } else {
          toast.error(resultAction.error as string);
        }
      } catch (error: any) {
        console.log('🚀 ~ error:', error);
        toast.error(error.message || 'SomeThing Went Wrong. try again');
      }
    },
    [dispatch, reset, router]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="token"
            render={({ field }) => (
              <FormControl error={Boolean(errors.token)}>
                <InputLabel>Enter OTP</InputLabel>
                <OutlinedInput {...field} label="Enter Name" />
                {errors.token ? <FormHelperText>{errors.token.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>New Password</InputLabel>
                <OutlinedInput {...field} label="New Password" type="password" />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirmPassword)}>
                <InputLabel>Confirm Password</InputLabel>
                <OutlinedInput {...field} label="Confirm Password" type="password" />
                {errors.confirmPassword && <FormHelperText>{errors.confirmPassword.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {errors.root && <Alert color="error">{errors.root.message}</Alert>}

          <Button disabled={isPending} type="submit" variant="contained">
            Reset Password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
