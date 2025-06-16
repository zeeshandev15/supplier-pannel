'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { paths } from '@/paths';
import { loginDefaultValues, LoginFormValues, loginSchema } from '@/lib/(schemas)/auth.schema';
import { loginUser } from '@/lib/api/auth/authApi';

export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({ defaultValues: loginDefaultValues, resolver: zodResolver(loginSchema) });

  const onSubmit = React.useCallback(
    async (values: LoginFormValues): Promise<void> => {
      try {
        const resultAction = await dispatch(loginUser(values));
        if (loginUser.fulfilled.match(resultAction)) {
          toast.success(resultAction.payload.message);
          reset();
          router.push(paths.dashboard.overview);
        } else {
          toast.error(resultAction.payload as string);
        }
      } catch (error: any) {
        toast.error(error.message || 'SomeThing Went Wrong');
      }
    },
    [router]
  );

  if (loading) return <p>Loading...</p>;
  return (
    <>
      <Stack spacing={4}>
        <Stack spacing={1}>
          <Typography variant="h4">Sign in</Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
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
                  <OutlinedInput
                    {...field}
                    endAdornment={
                      showPassword ? (
                        <EyeIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(false);
                          }}
                        />
                      ) : (
                        <EyeSlashIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={(): void => {
                            setShowPassword(true);
                          }}
                        />
                      )
                    }
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />

            <Box display="flex" justifyContent="space-between">
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account?{' '}
                <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
                  Sign up
                </Link>
              </Typography>

              <Typography color="text.secondary" variant="body2">
                <Link component={RouterLink} href={paths.auth.forgetPassword} underline="hover" variant="subtitle2">
                  Forget Password
                </Link>
              </Typography>
            </Box>
            <Button disabled={isPending} type="submit" variant="contained">
              Sign in
            </Button>
          </Stack>
        </form>
        <Alert color="warning">
          Use{' '}
          <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
            zeeshan11651@gmail.com
          </Typography>{' '}
          with password{' '}
          <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
            Secret1
          </Typography>
        </Alert>
      </Stack>
    </>
  );
}
