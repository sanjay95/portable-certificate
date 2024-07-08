import styled from 'styled-components'
import Box from 'src/components/common/Box/Box'
import { pxToRem } from 'src/utils'

export const Wrapper = styled.div`
  min-height: 100%;
  padding: 2rem 10rem;

`

export const Container = styled(Box)`
  border: solid 1px #e1e2ef;
`

export const Logo = styled(Box)`
  width: ${pxToRem(770)};
`

export const LogInContainer = styled(Box)`
  width: ${pxToRem(507)};
`

export const InnerLogInContainer = styled(Box)`
  width: ${pxToRem(347)};
`

export const Title = styled.div`
  font-size: ${pxToRem(32)};
  font-family: 'Poppins', sans-serif;
  font-weight: 700;

  div {
    line-height: 1;
    color: #ff5722;
  }
`
export const Content = styled.div`
  margin-top: ${pxToRem(24)};
  margin-bottom: ${pxToRem(32)};
  font-size: ${pxToRem(16)};
  font-family: 'lato', sans-serif;
  font-weight: 400;
`

export const ButtonContainer = styled(Box)`
  margin-top: ${pxToRem(48)};
`

export const OrContainer = styled(Box)`
  color: #dedede;

  span {
    margin: 0 ${pxToRem(20)};
  }
`

export const Line = styled.div`
  width: 141px;
  height: 1px;
  background-color: #d2d2d2;
`

export const NoAccount = styled.div`
  margin-top: ${pxToRem(52)};
  margin-bottom: ${pxToRem(44)};
  font-family: 'Poppins', 'sans-serif';
  font-size: ${pxToRem(14)};
`

export const Bold = styled.span`
  margin-left: ${pxToRem(8)};
  font-size: ${pxToRem(16)};
  font-family: 'Poppins', 'sans-serif';
  font-weight: 700;
  color: #10375c;
`

export const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: ${pxToRem(12)} ${pxToRem(24)};
  color: #ff5722;
  font-family: 'lato', 'sans-serif';
  cursor: pointer;

  button:nth-of-type(1) {
    margin-right: ${pxToRem(12)};
  }

  img {
    margin-right: ${pxToRem(12)};
  }

  ${({ variant }) =>
    variant === 'primary'
      ? `
      background: #373e97;
      color:#fff;
      margin-top:${pxToRem(52)};
    `
      : `
      background: #ff5722;
      color: #fff;
      margin-bottom:${pxToRem(52)};
    `}
`
export default Button