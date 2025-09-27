import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { Admin, initialAuthState} from "@/types/auth";
import { signUpInput, signInInput } from "@/schemas/auth";


// sign up async thunks
export const signUp = createAsyncThunk<
  { admin: Admin; token: string },
  { name: string; email: string; password: string; confirmPassword: string },
  { rejectValue: string | { fieldErrors: Record<string, string> } }
  >("auth/signUp", async (payload, thunkAPI) => {

  // zod validation
    const validation = signUpInput.safeParse(payload);
    if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    validation.error.issues.forEach((issue) => {  // ✅ Use `issues`
    if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
    });
    return thunkAPI.rejectWithValue({ fieldErrors });
}


  try {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/admin/signup`,
      payload,
      { withCredentials: true }
    );
    return { admin: res.data.admin, token: res.data.token };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Signup failed");
    }
    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
});

//sign in async thunk
export const signIn = createAsyncThunk<
  { admin: Admin; token: string },
  { email: string; password: string },
  { rejectValue: string | { fieldErrors: Record<string, string> } }
>("auth/signIn", async (payload, thunkAPI) => {

    //zod validate the sign in payload
    const validation = signInInput.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {  
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
    return thunkAPI.rejectWithValue({ fieldErrors });
  }
  try {
    const res = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/admin/signin`,
      payload,
      { withCredentials: true }
    );
    return { admin: res.data.admin, token: res.data.token };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
    }
    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
});

//slice code
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
      state.error = null;
      state.fieldErrors = null;
    },
    clearErrors(state) {
      state.error = null;
      state.fieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (action.payload?.fieldErrors) {
          state.fieldErrors = action.payload.fieldErrors;
        }
      })

      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (action.payload?.fieldErrors) {
          state.fieldErrors = action.payload.fieldErrors;
        }
      });
  },
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
