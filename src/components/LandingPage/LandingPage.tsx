import { FC } from 'react'
import Image from 'next/image'
import logo from 'public/images/logo.png'
import eventslogo from 'public/images/eventslogo.png'
import Box from '../common/Box/Box'

import * as S from './LandingPage.styled'

type Props = {
};

const LandingPage: FC<Props> = () => {

  return (
    <Box direction='row'>
      <S.ContentContainer justifyContent='center'>
        <S.Title>
          Learn More With Events & Webinars
          <div>Affinidi Trust Network</div>
        </S.Title>

        <S.Content>
          <p>Affinidi Events & Webinar</p>
          <p>Connect, Collaborate, and Innovate with Affinidi - Build Faster, Build Better.</p>
        </S.Content>
        
        <S.ButtonContainer direction='row'>
          <S.Button variant='primary' onClick={() => window.location.href = '/registration'}>Book Tickets</S.Button>
          <S.Button variant='secondary' onClick={() => window.open('https://www.affinidi.com/product/affinidi-vault', '_blank')}>Learn More</S.Button>
        </S.ButtonContainer>
      </S.ContentContainer>

      <S.Logo direction='row' justifyContent='flex-end' flex={1} >
        <Image src={eventslogo.src} alt='logo' width={900} height={487} />
      </S.Logo>
    </Box>
  )
}

export default LandingPage
