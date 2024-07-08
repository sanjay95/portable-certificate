import { useEffect, useState } from "react";
import useInitiateRequest, { VaultRequestType } from "@affinidi/affinidi-react-auth/dist/hooks/useInitiateRequest";
import { useCompleteRequest } from "@affinidi/affinidi-react-auth";

export default function useInitiateAnyRequest({
  presentationDefinition,
  callbackUrl,
  doVerification,
  useVerifyVpMutation,
}: VaultRequestType) {
  const [data, setData] = useState<any>();

  //Creating request using PEX
  const vaultRequest: VaultRequestType = {
    presentationDefinition,
    callbackUrl,
    doVerification,
    useVerifyVpMutation,
  };

  //Initalizing request
  const { isInitializing, isExtensionInstalled, handleInitiate } =
    useInitiateRequest(vaultRequest);

  //Completing the request
  const { vpToken, error, errorDescription, isLoading, isCompliant, presentationSubmission } =
    useCompleteRequest(vaultRequest);

  useEffect(() => {
    if (presentationSubmission && presentationDefinition.id === presentationSubmission.definition_id 
      && vpToken && !isLoading && isCompliant) {
      //received vp token and its valid
      vpToken.verifiableCredential.forEach((vc: any) => {
        const credentialSubject = Array.isArray(vc.credentialSubject) ? vc.credentialSubject[0] : vc.credentialSubject;
        setData((state: any) => ({ ...state, ...credentialSubject }));
      });
    }
  }, [vpToken, isLoading, isCompliant]);

  return {
    isInitializing,
    isExtensionInstalled,
    handleInitiate,
    isLoading: vpToken && isLoading,
    error,
    errorDescription,
    data,
  };
}
