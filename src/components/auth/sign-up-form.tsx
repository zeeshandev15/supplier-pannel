'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/material.css';

import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'react-toastify';

import { paths } from '@/paths';
import { registerationSchema, registerDefaultValues, RegistrationFormValues } from '@/lib/(schemas)/auth.schema';
import { registerUser } from '@/lib/api/auth/authApi';

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormValues>({
    defaultValues: registerDefaultValues,
    resolver: zodResolver(registerationSchema),
  });

  const onSubmit = React.useCallback(
    async (values: RegistrationFormValues): Promise<void> => {
      const updatedValues = {
        ...values,
        phone: `+${values.phone}`,
        verificationMethod: values.verificationMethod === true ? 'email' : 'phone',
      };

      try {
        const resultAction = await dispatch(registerUser(updatedValues));
        if (registerUser.fulfilled.match(resultAction)) {
          toast.success(resultAction.payload.message);
          reset();
          router.push('/auth/otp-verification');
        } else {
          toast.error(resultAction.payload as string);
        }
      } catch (error: any) {
        console.error('Error during registration:', error);
        toast.error(error.message || 'Something Went wrong try againe');
      }
    },
    [dispatch, reset, router]
  );

  return (
    <>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4">Sign up</Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormControl error={Boolean(errors.name)}>
                  <InputLabel>Full Name</InputLabel>
                  <OutlinedInput {...field} label="Full Name" />
                  {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(errors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} label="Email address" type="email" />
                  {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput {...field} label="Password" type="password" />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  country={'pk'}
                  enableSearch={true}
                  inputStyle={{
                    width: '100%',
                    height: '56px',
                    fontSize: '16px',
                  }}
                  containerStyle={{ width: '100%' }}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="verificationMethod"
              render={({ field }) => (
                <div>
                  <FormControlLabel control={<Checkbox {...field} />} label={<React.Fragment>Email</React.Fragment>} />
                  {errors.email ? <FormHelperText error>{errors.email.message}</FormHelperText> : null}
                </div>
              )}
            />

            <Controller
              control={control}
              name="verificationMethod"
              render={({ field }) => (
                <div>
                  <FormControlLabel control={<Checkbox {...field} />} label={<React.Fragment>Phone</React.Fragment>} />
                  {errors.phone ? <FormHelperText error>{errors.phone.message}</FormHelperText> : null}
                </div>
              )}
            />
            {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
            <Typography color="text.secondary" variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
                Sign in
              </Link>
            </Typography>
            <Button type="submit" variant="contained">
              Sign up
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
}
