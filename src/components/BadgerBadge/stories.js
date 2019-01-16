import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { text, boolean, number } from '@storybook/addon-knobs';

import BadgerBadge from './BadgerBadge';

storiesOf('BadgerBadge', module).add(
	'default',
	() => (
		<div style={{ display: 'flex' }}>
			<BadgerBadge
				price={number('Price', 0.01)}
				currency={text('Currency', "USD")}
				to={text('To Address', "bitcoincash:qrh335l4sn9rhr8jk23zympmvfud07lttufc7l6qdy")}
				tag={text('Button Text', "Badger Pay")}
				text={text('Top Text', "Send BCH")}
        successFn={() => console.log('success')}
        failFn={() => console.log('fail')}
			/>
		</div>
	),
	{
		notes:
			'Badger Badges are perfect for showing the price and Satoshis in a simple clean all in one component',
	}
);
