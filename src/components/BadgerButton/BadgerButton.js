import React from 'react'
import styled from 'styled-components';

const Main = styled.button`
  border-radius: 8px;
  color: palevioletred;
  background-color: mediumaquamarine;
  padding: 8px 15px;
  border: none;
  outline: none;
`

class BadgerButton extends React.Component {
  render() {
    const {children, ...rest} = this.props;
    return (
      <Main {...rest}>{children}</Main>
    )
  }
}

export default BadgerButton;