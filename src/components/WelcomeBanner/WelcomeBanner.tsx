import { FC, useState } from "react";
import Image from "next/image";

import close from "public/images/close.png";

import * as S from "./WelcomeBanner.styled";
import Box from "../common/Box/Box";


type Props = {
  userId?: string | null | undefined
  name: string | null | undefined
};

const WelcomeBanner: FC<Props> = ({ name, userId }) => {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  return (
    <S.BannerContainer>
      <S.Banner flexDirection="row">
        <Box
          direction="row"
          justifyContent="inherit"
          flex={2}
          alignItems="center"
        >
          <S.BannerTitle>{name && <>Welcome <i>{name}!</i></>} Your DID is <i>{userId}</i></S.BannerTitle>
          <S.CloseButton
            justifyContent="inherit"
            onClick={() => setIsClosed(true)}
          >
            <Image src={close.src} alt="close" width={12} height={12} />
          </S.CloseButton>
        </Box>
        
      </S.Banner>
    </S.BannerContainer>
  );
};

export default WelcomeBanner;
