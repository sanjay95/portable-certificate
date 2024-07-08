import styled from "styled-components";
import Box from "src/components/common/Box/Box";
import { pxToRem } from "src/utils";

export const Wrapper = styled.div`
  min-height: 100%;
  padding: ${pxToRem(10)} ${pxToRem(80)};
`;

export const Container = styled(Box)`
  border: solid 1px #e1e2ef;
`;

export const Logo = styled(Box)`
  width: 50%;
`;

export const LogInContainer = styled(Box)`
  width: 50%;
`;

export const InnerLogInContainer = styled(Box)`
  width: ${pxToRem(347)};
`;

export const Title = styled.div`
  margin-top: ${pxToRem(20)};
  font-size: ${pxToRem(32)};
  font-family: "Poppins", sans-serif;
  font-weight: 700;

  div {
    line-height: 1;
    color: #ff5722;
  }
`;
export const Content = styled.div`
  margin-top: ${pxToRem(10)};
  margin-bottom: ${pxToRem(20)};
  font-size: ${pxToRem(16)};
  font-family: "lato", sans-serif;
  font-weight: 400;
`;

export const ButtonContainer = styled(Box)`
  margin-top: ${pxToRem(20)};
`;

export const OrContainer = styled(Box)`
  color: #dedede;

  span {
    margin: 0 ${pxToRem(20)};
  }
`;

export const Line = styled.div`
  width: 141px;
  height: 1px;
  background-color: #d2d2d2;
`;

export const Button = styled.button<{ variant: "primary" | "secondary" }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: ${pxToRem(12)} ${pxToRem(24)};
  color: #ff5722;
  font-family: "lato", "sans-serif";
  cursor: pointer;
  box-shadow: 0 4px 16px 0 rgba(255, 87, 34, 0.32);

  button:nth-of-type(1) {
    margin-right: ${pxToRem(12)};
  }

  img {
    margin-right: ${pxToRem(16)};
  }

  ${({ variant }) =>
    variant === "primary"
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
`;

export default Button