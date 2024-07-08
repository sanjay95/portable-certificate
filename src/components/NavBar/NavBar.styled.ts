import styled from 'styled-components'

import { pxToRem } from 'src/utils'
import Box from '../common/Box/Box'

export const Container = styled(Box)`
  padding: ${pxToRem(28)} ${pxToRem(16)};
  height: ${pxToRem(32)};

  @media (min-width: 1024px) {
    padding: ${pxToRem(28)} ${pxToRem(80)};
    height: ${pxToRem(72)};
  }
`

export const NavigationContainer = styled(Box)`

`

export const Title = styled.div`
  color: #10375c;
  font-size: ${pxToRem(24)};
  font-family: 'playfair-display', 'sans-serif';
  font-weight: 700;
  user-select: none;
  cursor: pointer;
`
export const NavTabs = styled.div`
  color: #10375c;
  margin-right: ${pxToRem(40)};
  font-family: 'lato', 'sans-serif';
  width: max-content;
  font-weight: 700;
  cursor: pointer;
  font-size: 16px;
  
`

export const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  background: #fff;
  padding: 12px 24px;
  color: #ff5722;
  font-family: 'lato', 'sans-serif';
  cursor: pointer;
  border: 0px;

  button:nth-of-type(1) {
    margin-right: ${pxToRem(12)};
  }

  ${({ variant }) =>
    variant === 'primary'
      ? `
      background: #fff;
      color:#ff5722;
    `
      : `
      background: #ff5722;
      color: #fff;
    `}
`

export const Account = styled(Box)`
  cursor: pointer;
`

export const Avatar = styled.div`
  width: ${pxToRem(32)};
  height: ${pxToRem(32)};
  background-color: #10375c;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${pxToRem(16)};
  
  img {
    object-fit: cover;
    object-position: center center;
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }
`

export const Email = styled.div`
  color: #222831;
  font-size: ${pxToRem(16)};
  font-family: 'lato', 'sans-serif';
  font-weight: 700;
`

export const Loading = styled.div`
  color: #222831;
  font-size: ${pxToRem(16)};
  font-family: 'lato', 'sans-serif';
  font-weight: 700;
`
