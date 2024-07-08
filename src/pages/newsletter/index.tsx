import { FC, useEffect, useState } from 'react'

import { nanoid } from 'nanoid'
import { hostUrl } from 'src/utils/env_public'
import { useRouter } from 'next/router'

import ErrorModal from 'src/components/common/ErrorModal/ErrorModal'
import EmailVcModal from 'src/components/EmailVcModal/EmailVcModal'

import { useVerifyVpMutation } from 'src/hooks/verifier/useVerifyVpMutation'

import * as S from './index.styled'

//Lab1-Snippet-1
//Import and Create AIV Extension client
import { AivExtensionClient, AuthResponse } from '@affinidi/client-aiv-extension'
const client = new AivExtensionClient()


const Newsletter: FC = () => {
  const router = useRouter();

  //Lab1-Snippet-2
  //Check AIV Client status
  const [isInitializing, setIsInitializing] = useState(true)
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false)
  useEffect(() => {
    async function init() {
      setIsExtensionInstalled(await client.isInstalled())
      setIsInitializing(false)
    }

    init()
  }, [])


  //Lab1-Snippet-3
  //Create PEX definition
  const emailVCRequest = {
    id: "vp_token_with_email_vc",
    input_descriptors: [
      {
        id: "email_vc",
        name: "Email VC type",
        purpose: "Check if VC type is correct",
        constraints: {
          fields: [
            {
              path: ["$.credentialSchema.id"],
              filter: {
                type: "string",
                pattern:
                  "^https:\\/\\/schema\\.affinidi\\.com\\/EmailV1-0\\.json$",
              },
            },
          ],
        },
      },
    ],
  };


  async function handleOnClick() {

    //Lab1-Snippet-4
    //Create a function to initialize VC to AIV
    if (!isExtensionInstalled) {
      window.location.href = client.getChromeWebStoreUrl();
      return;
    }

    //Initiate request to AIV (makes sync http get request to chrome extention)
    client.initiateAuth({
      nonce: nanoid(), //Random Id
      state: nanoid(),
      responseDestination: {
        responseMode: "query",
        redirectUri: `${hostUrl}/newsletter`, //callback to same component with vp_token
      },
      presentationDefinition: emailVCRequest,
    });

  }

  //Lab1-Snippet-5
  //Read data from AIV Extension callback with vp_token
  const [error, setError] = useState<string>();
  const [vpToken, setVpToken] = useState<any>();
  const [presentationSubmission, setPresentationSubmission] = useState<any>();
  useEffect(() => {
    //checking if query string has any vp_token or error
    const { vp_token, state, presentation_submission, error, error_description } = router.query;
    //set error if we receive error
    if (error) {
      setError(error + " " + error_description);
      return;
    }
    //return if callback url does not have these params
    if (!vp_token || !state || !presentation_submission) return;

    try {
      //Read the response from callback URL
      const response = client.completeAuth(window.location.href);
      if ('error' in response) {
        setError(response.error + " " + response.errorDescription);
      } else {
        setVpToken(response.vpToken);
        setPresentationSubmission(response.presentationSubmission);
      }

    } catch (err: any) {
      setError(err.messsage || "Unexpected error");
    }
  }, [client, setVpToken, setPresentationSubmission, router]);


  //Lab1-Snippet-6
  //Add VP verification of vp_token
  const { mutate: verifyVP, ...verifyResult } = useVerifyVpMutation();
  useEffect(() => {
    if (vpToken) {
      // Call our VP verification API endpoint(code: pages\api\verifier\verify-vp.ts) which internally calls Affinidi API for verification
      verifyVP({
        verifiablePresentation: vpToken,
        presentationSubmission,
        presentationDefinition: emailVCRequest,
      });
    }
  }, [vpToken, presentationSubmission, verifyVP]);

  useEffect(() => {
    //if any error during verification then clear vp_token and set error
    if (verifyResult.error) {
      setVpToken(undefined);
      setPresentationSubmission(undefined);
      setError("Could not verify your data " + verifyResult.error.message);
    }
  }, [verifyResult.error]);


  return (
    <S.Wrapper>
      <S.TileWrapper direction='column'>
        <S.TileHeader>Newsletter</S.TileHeader>
        <span />
      </S.TileWrapper>

      <S.SubscribeLink onClick={handleOnClick}>Share your email and subscribe to our newsletter</S.SubscribeLink>

      {/* //Lab1-Snippet-7 */}
      {/* //Display error if any or Email from VC */}
      {error && <ErrorModal error={error} />}
      {vpToken && <>
        <EmailVcModal
          isLoading={verifyResult.isIdle || verifyResult.isLoading}
          isCompliant={Boolean(verifyResult.data?.isCompliant)}
          emailVc={vpToken.verifiableCredential[0]}
        />
      </>}

 
    </S.Wrapper>
  )
}

export default Newsletter
