import styled from 'styled-components';

import colors from '../styles/colors';

const Button = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: ${(props) =>
		props.color2 ? props.color2 : colors.bchOrange};
  border: 2px solid
    ${(props) => (props.color1 ? props.color1 : colors.bchOrange)};
  padding: 6px 10px;
  color: ${(props) => (props.color1 ? props.color1 : colors.bg)};
  box-shadow: 2px 2px 2px ${colors.bchGrey};
  &:hover {
    background-color: ${(props) => (props.color1 ? props.color1 : colors.bg)};
    color: ${(props) => (props.color2 ? props.color2 : colors.bchOrange)};
    box-shadow: 1px 1px 1px ${colors.bchGrey};
  }
  }
`;

export default Button;
