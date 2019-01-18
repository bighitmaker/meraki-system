import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { text, boolean, number } from '@storybook/addon-knobs';

import BadgerButton from './BadgerButton';

storiesOf('BadgerButton', module).add(
	'default',
	() => (
		<BadgerButton
			price={number('Price', 0.001)}
			currency={text('Currency', 'USD')}
			to={text(
				'To Address',
				'bitcoincash:qrh335l4sn9rhr8jk23zympmvfud07lttufc7l6qdy'
			)}
			tag={text('Button Text', 'Badger Pay')}
			text={text('Top Text', 'Payment Total')}
			showBrand={boolean('Show Brand', true)}
			showSatoshis={boolean('Show Satoshis', true)}
			successFn={() => console.log('success')}
			failFn={() => console.log('fail')}
		>
			This is it!
		</BadgerButton>
	),
	{
		notes:
			'Basic Badger Button.  Perfect for adding Badger integration to an existing flow, or in a minimal way',
	}
);
