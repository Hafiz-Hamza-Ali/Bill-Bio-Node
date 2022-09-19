import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { Link as RouterLink,useNavigate} from 'react-router-dom';
import axios from "axios";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    setPassword('');
    setEmail('');
},[]);
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'demo@minimals.cc',
    password: 'demo1234',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const Login = async (e) => {
    e.preventDefault();
     console.log(email);
    // console.log(password);
    try {
     const response= await axios.post('/api/user/login', {
        email,
        password
    });
    if(response.data.token)
    {
    const dash= await axios.get('/api/user/dashboard');
      if(dash){

      
        navigate('/dashboard');
      }else{
        navigate('/');
      }
    }
    else{
      navigate('/');
    }
   
    } catch (error) {

      reset();

      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={Login}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton  onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx ={{ boxShadow:"none"}}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
