import { useFetchUserInfoQuery } from "./useFetchUserInfoQuery";

export function useAuthentication() {
  const { data, status } = useFetchUserInfoQuery();

  return {
    isLoading: status === "loading",
    isAuthenticated: status === "success",
    ...data,
  };
}
