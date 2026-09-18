import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { getApiErrorMessage, http } from "../api/http";
import { queryKeys } from "../api/queryKeys";
import type { LoginResponse, User } from "../store/auth/auth.interface";
import {
  logout as logoutAction,
  selectIsAuthenticated,
  selectToken,
  selectUser,
  setAuthError,
  setAuthLoading,
  setCredentials,
  setUser,
  updateCurrentUser,
} from "../store/auth/auth.slice";
import { useAppDispatch } from "../store/types";
import { isAccessTokenExpired } from "../utils/jwt";

type LoginInput = {
  email: string;
  password: string;
};

type UpdateMeInput = {
  name?: string;
  email?: string;
  avatarUrl?: string | null;
};

export const useLoginMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginInput) => {
      const { data } = await http.post<LoginResponse>("/auth/login", payload);
      return data;
    },
    onMutate: () => {
      dispatch(setAuthLoading(true));
      dispatch(setAuthError(null));
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      queryClient.setQueryData(queryKeys.auth.me, data.user);
    },
    onError: (error) => {
      dispatch(setAuthError(getApiErrorMessage(error, "Login failed")));
    },
    onSettled: () => {
      dispatch(setAuthLoading(false));
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return () => {
    dispatch(logoutAction());
    queryClient.clear();
  };
};

export const useMeQuery = (enabled = true) => {
  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const { data } = await http.get<User>("/auth/me");
      return data;
    },
    enabled,
  });

  useEffect(() => {
    if (query.data && token) {
      dispatch(setUser(query.data));
    }
  }, [dispatch, query.data, token]);

  return query;
};

/** Revalidate persisted session against `/auth/me` while authenticated. */
export const useSessionSync = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const tokenExpired = Boolean(token && isAccessTokenExpired(token));
  const sessionOk = Boolean(isAuthenticated && user && token && !tokenExpired);

  useEffect(() => {
    if (tokenExpired || ((isAuthenticated || user) && !token)) {
      dispatch(logoutAction());
      queryClient.clear();
    }
  }, [dispatch, isAuthenticated, queryClient, token, tokenExpired, user]);

  useMeQuery(sessionOk);

  return {
    isAuthenticated: sessionOk,
    user: sessionOk ? user : null,
  };
};

export const useUpdateMeMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateMeInput) => {
      const { data } = await http.patch<User>("/auth/me", payload);
      return data;
    },
    onSuccess: (user) => {
      dispatch(setUser(user));
      dispatch(updateCurrentUser(user));
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
};
