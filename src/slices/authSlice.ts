'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import libApi from '@/utils/libApi';
import { type UserInterface, validateUser } from '@/types/post.types';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  personInfo: UserInterface | null;
  isAuth: boolean;
}

interface JwtPayloadWithExp {
  exp: number;
  iat: number;
  userId: number;
}

const initialState: AuthState = {
  personInfo: (() => {
    if (typeof window !== 'undefined') {
      const storedPersonInfo = localStorage.getItem('personInfo');
      if (storedPersonInfo && storedPersonInfo !== 'undefined') {
        return validateUser(JSON.parse(storedPersonInfo));
      }
    }
    return null;
  })(),
  isAuth: (() => {
    if (typeof window !== 'undefined') {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          return false;
        }
        const decodedToken = jwtDecode<JwtPayloadWithExp>(authToken);
        const currentTime = Math.floor(Date.now() / 1000);
        return decodedToken.exp > currentTime;
      } catch {
        return false;
      }
    }
    return false;
  })(),
};

export const logInUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await libApi.post(
        '/login',
        {
          email: email.trim().toLowerCase(),
          password: password,
        },
        false,
      );
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
);

export const logUpUser = createAsyncThunk(
  'auth/sign-up',
  async ({ email, password }: { email: string; password: string }) => {
    try {
      return await libApi.post(
        '/sign-up',
        {
          email: email.trim().toLowerCase(),
          password: password,
        },
        false,
      );
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
);

export const logOutUser = createAsyncThunk('auth/logout', async () => {
  try {
    return await libApi.post('/logout', {});
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logInUser.fulfilled, (state, action) => {
        state.isAuth = true;

        const currentUser: UserInterface = validateUser(action.payload.user);
        state.personInfo = currentUser;

        localStorage.setItem('isAuth', JSON.stringify(true));
        if (typeof action.payload.token === 'string') {
          localStorage.setItem('authToken', action.payload.token);
        }
        localStorage.setItem('personInfo', JSON.stringify(currentUser));
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.personInfo = null;

        localStorage.setItem('isAuth', JSON.stringify(false));
        localStorage.setItem('authToken', '');
        localStorage.setItem('personInfo', JSON.stringify(undefined));
      });
  },
});

export default authSlice.reducer;
