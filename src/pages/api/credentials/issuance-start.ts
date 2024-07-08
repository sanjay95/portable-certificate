import { z } from 'zod'
import { use } from 'next-api-middleware'
import type { NextApiRequest, NextApiResponse } from 'next'

import { allowedHttpMethods } from '../middlewares/allowed-http-methods'
import { errorHandler } from '../middlewares/error-handler'
import { ApiError } from '../api-error'
import { logger } from '../logger'
import { StartIssuanceInput, StartIssuanceInputClaimModeEnum, StartIssuanceResponse } from '@affinidi-tdk/credential-issuance-client'
import { CredentialsClient } from '../clients/credentials-client'


const issuanceStartSchema = z
    .object({
        credentialTypeId: z.string(),
        holderDid: z.string(),
        credentialData: z.any()
    })
    .strict()

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StartIssuanceResponse>
) {
    const {
        credentialTypeId,
        credentialData,
        holderDid,
    } = issuanceStartSchema.parse(req.body)

    try {
        const apiData: StartIssuanceInput = {
            claimMode: StartIssuanceInputClaimModeEnum.TxCode,
            holderDid,
            data: [
                {
                    credentialTypeId,
                    credentialData: {
                        ...credentialData,
                        creddate: new Date().toISOString(),
                    },
                },
            ],
        }

        const issuanceResult = await CredentialsClient.IssuanceStart(apiData);

        console.log('issuanceResult post backend call', issuanceResult)

        res.status(200).json(issuanceResult)
    } catch (error: any) {
        logger.debug(
            { response: error.response?.data ?? error },
            'Issuance failed'
        )
        throw error
    }

}

export default use(allowedHttpMethods('POST'), errorHandler)(handler)