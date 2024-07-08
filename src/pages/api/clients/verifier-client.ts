// TODO: replace with client-sdk

import axios from 'axios'
import { apiKeyHash, verifierApiUrl, projectScopeToken } from 'src/utils/env'

type VerifyPresentationOutput = {
  errors: string[]
  isValid: boolean
}

export const verifierClient = {
  verifyPresentation: async (input: {
    verifiablePresentation: any
    presentationDefinition: any
    presentationSubmission: any
  }): Promise<VerifyPresentationOutput> => {
    const { data } = await axios<VerifyPresentationOutput>(
      `${verifierApiUrl}/v1/verifier/verify-vp`,
      {
        method: 'POST',
        headers: {
          ...(projectScopeToken && { 'Authorization': projectScopeToken } || { 'Api-Key': apiKeyHash })
        },
        data: input,
      }
    )

    return data
  },
}
