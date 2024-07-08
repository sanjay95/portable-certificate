import { NextApiRequest, NextApiResponse } from 'next'
import { Session, getServerSession } from 'next-auth'
import { ApiError } from '../api-error'
import { authOptions } from '../auth/[...nextauth]'

export async function authenticate(req: NextApiRequest, res: NextApiResponse): Promise<Session> {
  const session = await getServerSession(req, res, authOptions)
  const accessToken = session?.accessToken

  if (!accessToken) {
    throw new ApiError({
      code: 'NOT_AUTHENTICATED',
      message: 'Access token is not present in the cookies',
      httpStatusCode: 401,
    })
  }

  return session
}
