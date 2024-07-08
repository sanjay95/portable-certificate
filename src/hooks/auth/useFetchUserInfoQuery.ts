import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { hostUrl } from 'src/utils/env_public'
import { ErrorResponse } from '../../types/error'

export const useFetchUserInfoQuery = () => {
  return useQuery<any, ErrorResponse, { userId: string; email?: string, name? : string, image?: string }>(
    ['userInfo'],
    async (data) => {
      return (await axios<any>(
        `${hostUrl}/api/auth/get-user-info`,
        { method: 'GET', data }
      )).data
    },
    { retry: false }
  )
}
