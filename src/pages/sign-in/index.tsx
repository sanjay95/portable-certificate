import { FC, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

import { hostUrl } from 'src/utils/env_public'
import Input from 'src/components/common/Input/Input'

import signInImage from 'public/images/sign-in.png'

import * as S from './index.styled'
import { AffinidiLoginButton } from '@affinidi/affinidi-react-auth'
import useInitiateAnyRequest from 'src/hooks/useInitiateAnyRequest'
import { useRouter } from 'next/router'
import { Checkbox } from '@mui/material'
import { presentationDefinitions } from 'src/utils/presentation-definitions'

const LogIn: FC = () => {
  const { push } = useRouter()
  const [isHuman, setIsHuman] = useState(false)

  //Login Handler
  async function logIn() {
    //Call next-auth's signIn method by passing provider id as Affinidi
    await signIn('Affinidi', { callbackUrl: hostUrl })
  }

  const {
    isInitializing,
    isExtensionInstalled,
    handleInitiate: robotHandler,
    isLoading,
    error,
    errorDescription,
    data: livenessData,
  } = useInitiateAnyRequest({
    presentationDefinition: presentationDefinitions.livenessVC,
    callbackUrl: `${hostUrl}/liveness-callback`,
    doVerification: false,
  })

  useEffect(() => {
    if (livenessData) {
      setIsHuman(livenessData.livenessCheckPassed)
      if (!livenessData.livenessCheckPassed) {
        alert('Hey Liveness check failed, so you are robot')
      }
      push('/sign-in')
    }
  }, [livenessData])

  useEffect(() => {
    if (error && errorDescription) {
      alert(`Liveness check error : ${error} - ${errorDescription}`)
      setIsHuman(false)
      push('/sign-in')
    }
  }, [error, errorDescription])

  return (
    <S.Wrapper>
      <S.Container direction="row">
        <S.Logo direction="row" justifyContent="flex-start" flex={1}>
          <Image src={signInImage.src} alt="sign in" width={700} height={400} style={{ objectFit: 'cover' }} />
        </S.Logo>

        <S.LogInContainer justifyContent="center" alignItems="center">
          <S.InnerLogInContainer>
            <S.Title>Log In</S.Title>

            <S.Content>Please enter a your email address to log in.</S.Content>

            <Input id="email" type="email" label="Email" placeholder="example@affinidi.com" />

            <S.ButtonContainer direction="column">
              <S.Button variant="secondary">Log In</S.Button>

              <div onClick={(!isHuman && robotHandler) || (() => {})} style={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  src={isHuman ? '/images/icons8-checkbox-checked.png' : '/images/icons8-checkbox-48-unchecked.png'}
                  alt="close"
                  width={35}
                  height={35}
                  onClick={(!isHuman && robotHandler) || (() => {})}
                />
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>I am not a robot</span>
              </div>

              <S.OrContainer direction="row" justifyContent="center" alignItems="center">
                <S.Line />
                <span>OR</span>
                <S.Line />
              </S.OrContainer>

              <AffinidiLoginButton
                logInHandler={logIn}
                containerStyles={{ padding: 0, paddingTop: '2rem' }}
                buttonStyles={{ width: '100%', height: 'auto' }}
              />
            </S.ButtonContainer>
          </S.InnerLogInContainer>
        </S.LogInContainer>
      </S.Container>
    </S.Wrapper>
  )
}

export default LogIn
