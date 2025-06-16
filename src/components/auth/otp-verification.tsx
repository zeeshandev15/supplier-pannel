'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { Box, Button, Typography } from '@mui/material';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';

import { otpVerification } from '@/lib/api/auth/authApi';

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleVerify = useCallback(async () => {
    try {
      await dispatch(otpVerification(otp)).unwrap();
      toast.success('OTP verification Successfull');
      router.push('/auth/sign-in');
    } catch (error) {
      toast.error(error as string);
    }
  }, [otp, dispatch, router]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          maxWidth: 400,
          mx: 'auto',
          mt: 5,
          p: 3,
          border: '1px solid #ccc',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Enter OTP
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We’ve sent a 5-digit code to your email/phone.
        </Typography>

        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={5}
          renderSeparator={<span>-</span>}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            width: '3rem',
            height: '3rem',
            margin: '0 0.5rem',
            fontSize: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            textAlign: 'center',
          }}
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleVerify} disabled={otp.length !== 5}>
          Verify OTP
        </Button>

        <Typography variant="body2" color="text.secondary">
          Didn’t receive the code? <Button variant="text">Resend OTP</Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default OTPVerification;
