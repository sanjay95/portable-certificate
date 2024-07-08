import { FC, useEffect, useState } from "react";
import "react-responsive-modal/styles.css";

import * as S from "./LoadingModal.styled";

type ModalProps = {
  title: string
  message: string
};

const LoadingModal: FC<ModalProps> = ({ title, message }) => {

  return (<S.Modal open={true} center>
    <S.ModalWrapper>
      <S.Title>{title}...</S.Title>
      <S.SubTitle>
        {message}
      </S.SubTitle>
    </S.ModalWrapper>
  </S.Modal>)
};

export default LoadingModal;
