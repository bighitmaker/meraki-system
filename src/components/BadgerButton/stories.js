import React from 'react';

import BadgerButton from './BadgerButton';
import { storiesOf } from '@storybook/react/dist/client/preview';

storiesOf('BadgerButton', module).add(
	'default',
	() => <BadgerButton>This is it!</BadgerButton>,
	{
		notes:
			'Basic Badger Button.  Perfect for adding Badger integration to an existing flow, or in a minimal way',
	}
);
