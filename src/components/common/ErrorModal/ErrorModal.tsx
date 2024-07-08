import { FC, useState } from "react";
import "react-responsive-modal/styles.css";

import * as S from "./ErrorModal.styled";
import { useRouter } from "next/router";

type ModalProps = {
  error: string
  errorDescription?: string
  closeCallback?: string
};

const ErrorModal: FC<ModalProps> = ({ error, errorDescription, closeCallback }) => {
  const { push } = useRouter();
  const [open, setOpen] = useState(true);

  async function onCloseModal() {
    setOpen(false);
    if (closeCallback)
      push(closeCallback);
  }

  return <S.Modal open={open} onClose={onCloseModal} center>
    <S.ModalWrapper>
      <S.Title>Whoops!</S.Title>
      <S.SubTitle>
        Something went wrong, please try again.
        <br />
        <br />
        Reason: {error}
        {errorDescription ? <><br />{errorDescription}</> : ''}
      </S.SubTitle>
    </S.ModalWrapper>
  </S.Modal>
};

export default ErrorModal;
