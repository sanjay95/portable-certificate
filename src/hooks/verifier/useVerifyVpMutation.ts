import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { hostUrl } from 'src/utils/env_public'
import { ErrorResponse } from '../../types/error'

type VerifyPresentationOutput = {
  isCompliant: boolean
}

export const useVerifyVpMutation = () => {
  return useMutation<VerifyPresentationOutput, ErrorResponse, { verifiablePresentation: any; presentationSubmission: any; presentationDefinition: any }>(['verifyVp'], async (data) => {
    const response  = await axios<VerifyPresentationOutput>(
      `${hostUrl}/api/verifier/verify-vp`,
      { method: 'POST', data }
    )
    let dataResponse = response.data
    if(typeof(dataResponse)  == 'string') {
      dataResponse = JSON.parse(dataResponse);
    }
  
    return { isCompliant: dataResponse.isCompliant }
  })
}
