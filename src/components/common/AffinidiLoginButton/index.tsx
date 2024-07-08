import React, { HTMLAttributes, MouseEventHandler } from 'react'
import Image from "next/image";
import LogoAffinidi from 'public/images/logo-affinidi.svg'
import { pxToRem } from 'src/utils';
import styled from 'styled-components';

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: ${pxToRem(12)} ${pxToRem(24)};
  color: #ff5722;
  font-family: 'lato', 'sans-serif';
  cursor: pointer;
  box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);

  button:nth-of-type(1) {
    margin-right: ${pxToRem(12)};
  }

  img {
    margin-right: ${pxToRem(16)};
  }

  ${({ variant }) =>
    variant === 'primary'
      ? `
      background: #1d58fc;
      color:#fff;
      box-shadow: 0 4px 16px 0 rgba(55, 62, 151, 0.32);
      margin-top:${pxToRem(20)};
    `
      : `
      background: #ff5722;
      color: #fff;
      box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);
      margin-bottom:${pxToRem(20)};
    `}
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  logInHandler: MouseEventHandler | undefined;
}

const AffinidiLoginButton: React.FC<Props> = ({
  logInHandler,
  ...props
}) => (
  <Button variant='primary' onClick={logInHandler} >
    <Image src={LogoAffinidi} alt='logo affinidi' />
    Affinidi Login
  </Button>
)

export default AffinidiLoginButton
