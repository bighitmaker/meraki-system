import React from 'react'

import BadgerButton from './BadgerButton'
import { storiesOf } from '@storybook/react/dist/client/preview';

storiesOf('BadgerButton', module)
  .add('default', () => (
    <BadgerButton>This is it!</BadgerButton>
  ))