import { Modal as ReactModal } from 'react-responsive-modal'
import "react-responsive-modal/styles.css";
import styled from 'styled-components'

import { pxToRem } from 'src/utils'

export const Modal = styled(({ classNames, ...rest }) => (
  <ReactModal {...rest} classNames={{ ...classNames}}/>
))`
  .modal {
    background: red;
    color: red;
  }

  .react-responsive-modal-container {
    background: red;
  }

  .react-responsive-modal-modal {
    background: red;
    color: #6a6a6a;
  }
`

export const ModalWrapper = styled.div`
  margin: ${pxToRem(48)};
  width: ${pxToRem(370)};
`

export const Title = styled.div`
  margin: ${pxToRem(16)} ${pxToRem(12)} ${pxToRem(32)} 0;
  font-family: 'lora';
  font-size: ${pxToRem(52)};
  font-weight: bold;
  color: #10375c;
`

export const SubTitle = styled.div`
  margin: ${pxToRem(32)} ${pxToRem(16)} ${pxToRem(24)} 0;;
  font-family: 'lato';
  font-size: ${pxToRem(20)};
  line-height: 1.5;
  color: #6a6a6a;
`

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 20px;
  }
`

export const InnerButtonContainer = styled.div`
display: flex;
flex-direction: row;

& > *:not(:first-child) {
  margin-left: 20px;
  justify-content: center;
}
`


export const Code = styled.div`
  height: ${pxToRem(46)};
  font-family: 'lora';
  font-size: ${pxToRem(36)};
  font-weight: bold;
  color: #10375c;
`

export const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  text-align: center;
  background: #10375c;
  width: 140px;
  height: 43px;
  padding: 12px 24px;
  font-family: 'lato', 'sans-serif';
  font-size: ${pxToRem(16)};
  font-weight: 700;
  cursor: pointer;

  ${({ variant }) =>
    variant === 'primary'
      ? `
      background: #10375c;
      color:#fff;
      box-shadow: 0 4px 16px 0 rgba(16, 55, 92, 0.32);

    `
      : `
      background: #fff;
      color: ##10375c;
      border: 1px solid #10375c;
    `}
`
