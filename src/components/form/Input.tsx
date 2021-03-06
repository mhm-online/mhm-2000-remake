import styled from "@emotion/styled";

const Input = styled.input`
  border: 1px solid rgb(99, 99, 99);
  border-radius: 5px;
  padding: 0.5em;
  font-family: inherit;

  &:disabled {
    opacity: 0.5;
  }

  ${props =>
    props.block &&
    `width: 100%;
    display: block;
  `}
`;

export default Input;
