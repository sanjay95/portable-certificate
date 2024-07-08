import { FC, useEffect, useState } from 'react'

import DebtIcon from 'public/images/debt-icon.svg'
import EducationIcon from 'public/images/education-icon.svg'

import * as S from './index.styled'
import { useSession } from 'next-auth/react'
import WelcomeBanner from 'src/components/WelcomeBanner/WelcomeBanner'
import LandingPage from 'src/components/LandingPage/LandingPage'
import Tile from 'src/components/common/Tile/Tile'

const Home: FC = () => {
  const { data: session } = useSession()
  const { userId, name } = session?.user || {}

  return (
    <S.Wrapper>
      {userId && <WelcomeBanner name={name} userId={userId} />}

      <LandingPage />
      
      <S.TileWrapper direction='column'>
        <S.TileHeader>Already Attended Webinar</S.TileHeader>
        <span />

        <S.ButtonContainer direction='row'>
          <S.Button variant='primary' onClick={() => window.location.href = '/credentials'}>Claim Certificate Here</S.Button>
        </S.ButtonContainer>
      </S.TileWrapper>
     
       <S.TileWrapper direction='column'>
        <S.TileHeader>Why Attend?</S.TileHeader>
        <span />

        <S.TileContainer direction='row' justifyContent='space-between'>
          <Tile text='It gives Opportunity to meet, listen, and network.' icon={DebtIcon}></Tile>
          <Tile text='More Speakers, Lighting talks, workshops, FUN and more.' icon={EducationIcon}></Tile>
          <Tile text='Devs from all over the globe for our event day.' icon={EducationIcon}></Tile>
          <Tile text='More Booths' icon={EducationIcon}></Tile>
        </S.TileContainer>
      </S.TileWrapper>
    </S.Wrapper>
  )
}

export default Home

