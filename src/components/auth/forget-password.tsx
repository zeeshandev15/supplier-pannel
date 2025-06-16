'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { z as zod } from 'zod';

import { paths } from '@/paths';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
});

type Values = zod.infer<typeof schema>;

const defaultValues: Values = {
  email: '',
};

export function ForgetPasswordForm(): React.JSX.Element {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      try {
        const response = await fetch(`http://localhost:8001/api/auth/password/forgot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(`${result.message} || Something went wrong`);
        }
        toast.success(`${result.message}`);
        reset();
        router.push(paths.auth.resetPassword);
        setIsPending(true);
      } catch (error: unknown) {
        console.error('Error during reset password:', error);
        toast.error('Something went wrong. Try again.');
      }
    },
    [router, reset]
  );

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Email Field */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email && <FormHelperText>{errors.email.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {errors.root && <Alert severity="error">{errors.root.message}</Alert>}

          <Button variant="contained" type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <span className="loader" /> Sending...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
