import { z } from 'zod'
import { use } from 'next-api-middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

import { allowedHttpMethods } from '../middlewares/allowed-http-methods'
import { errorHandler } from '../middlewares/error-handler'
import { ApiError } from '../api-error'
import { logger } from '../logger'
import { apiGatewayUrl, skipVerification } from 'src/utils/env'
import { VerifyPresentationInput, } from '@affinidi-tdk/credential-verification-client'
import { CredentialsClient } from '../clients/credentials-client'

type HandlerResponse = {
  isCompliant: boolean
}

const requestSchema = z
  .object({
    presentationDefinition: z.any(),
    presentationSubmission: z.any(),
    verifiablePresentation: z.any(),
  })
  .strict()

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HandlerResponse>
) {
  const {
    verifiablePresentation,
    presentationDefinition,
    presentationSubmission,
  } = requestSchema.parse(req.body)

  if (skipVerification) {
    logger.warn('VP token is not being verified due to missing env variables, so skipping verification')

    res.status(200).json({ isCompliant: true })
    return;
  }

  try {
    const data: VerifyPresentationInput = {
      verifiablePresentation,
      presentationDefinition,
      presentationSubmission,
    }
    const verificationResult = await CredentialsClient.verifyPresentation(data)

    console.log('verificationResult', verificationResult)

    if (!verificationResult.isValid) {
      throw new ApiError({
        code: 'INVALID_VP_TOKEN',
        context: { errors: verificationResult.errors },
      })
    }

    res.status(200).json({ isCompliant: true })

  } catch (error: any) {
    logger.debug(
      { response: error.response?.data ?? error },
      'Verification failed'
    )
    throw error
  }


}

export default use(allowedHttpMethods('POST'), errorHandler)(handler)
