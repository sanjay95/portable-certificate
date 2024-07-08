import { FC, useState } from "react";
import "react-responsive-modal/styles.css";


import * as S from "./EmailVcModal.styled";
import { useRouter } from "next/router";

type ModalProps = {
  isLoading: boolean
  isCompliant: boolean
  emailVc: {
    credentialSubject: {
      email: string
    }
  }
};

const EmailVcModal: FC<ModalProps> = ({ isLoading, emailVc, isCompliant }) => {
  const [open, setOpen] = useState(true);
  const { push } = useRouter();

  async function onCloseModal() {
    setOpen(false);
    push('/newsletter');
  }

  if (isLoading) {
    return <S.Modal open={open} onClose={onCloseModal} center>
      <S.ModalWrapper>
        <S.Title>Verifying...</S.Title>
        <S.SubTitle>
          Please wait for a few seconds until we check your data.
        </S.SubTitle>
      </S.ModalWrapper>
    </S.Modal>
  }

  if (!isCompliant) {
    return <S.Modal open={open} onClose={onCloseModal} center>
      <S.ModalWrapper>
        <S.Title>We’re sorry!</S.Title>
        <S.SubTitle>
          Seems your Email VC is InValid
        </S.SubTitle>
      </S.ModalWrapper>
    </S.Modal>
  }

  return <S.Modal open={open} onClose={onCloseModal} center classNames={{ modal: 'modal' }}>
    <S.ModalWrapper>
      <S.Title>Hooray!</S.Title>
      <S.SubTitle>
        Thanks for sharing your email:
        <br />
        <b>{emailVc.credentialSubject.email}</b>
      </S.SubTitle>
    </S.ModalWrapper>
  </S.Modal>
};

export default EmailVcModal;
