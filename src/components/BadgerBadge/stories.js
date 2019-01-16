import React from 'react'

import BadgerBadge from './BadgerBadge'
import { storiesOf } from '@storybook/react/dist/client/preview';

storiesOf('BadgerBadge', module)
  .add('default', () => (
    <BadgerBadge
      price={0.01}
      currency="CAD" 
      to="bitcoincash:qrh335l4sn9rhr8jk23zympmvfud07lttufc7l6qdy"
      tag="Start Send"
      text="Donate to SpicyPete"
    />
  ))