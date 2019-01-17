import styled from 'styled-components';

import colors from '../styles/colors';

const Button = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 2px;
  background-color: ${(props) =>
		props.color2 ? props.color2 : colors.brand500};
  /* border: 2px solid
    ${(props) => (props.color1 ? props.color1 : colors.brand500)}; */
  padding: 12px 20px;
  color: ${(props) => (props.color1 ? props.color1 : colors.bg)};
  box-shadow: 1px 1px 1px ${colors.bchGrey};
  transform: translateY(0px);
  &:hover {
    background-color: ${(props) => (props.color1 ? props.color1 : colors.brand700)};
    color: ${(props) => (props.color2 ? props.color2 : colors.bg)};
    box-shadow: 0px 0px 0px ${colors.bchGrey};
    transform: translateY(2px);
  }
  }
`;

export default Button;
