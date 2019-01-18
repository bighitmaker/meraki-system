// @flow

import React from 'react';

import { storiesOf } from '@storybook/react/dist/client/preview';
import { select, text, boolean, number } from '@storybook/addon-knobs';

import BadgerBadge from './BadgerBadge';

const currencyOptions = ['USD', 'CAD', 'HKD', 'JPY', 'GBP', 'EUR', 'CNY'];

storiesOf('BadgerBadge', module)
	.add(
		'default',
		() => (
			<div style={{ display: 'flex' }}>
				<BadgerBadge
					price={number('Price', 0.01)}
					currency={select('Currency', currencyOptions, 'USD')}
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
				/>
			</div>
		),
		{
			notes:
				'Badger Badges are perfect for showing the price and Satoshis in a simple clean all in one component.  Default has knobs to experiment with all settings',
		}
	)
	.add(
		'custom text',
		() => (
			<div style={{ display: 'flex' }}>
				<BadgerBadge
					price={0.01}
					currency={'USD'}
					to={text(
						'To Address',
						'bitcoincash:qrh335l4sn9rhr8jk23zympmvfud07lttufc7l6qdy'
					)}
					tag={text('Button Text', 'And the CTA')}
					text={text('Top Text', 'Customize the Title')}
					successFn={() => console.log('success')}
					failFn={() => console.log('fail')}
				/>
			</div>
		),
		{
			notes: 'Customize the title and button text',
		}
	)
	.add(
		'currency variety',
		() => (
			<div style={{ display: 'flex' }}>
				<BadgerBadge
					price={number('Price', 0.01)}
					currency={select('Currency', currencyOptions, 'USD')}
					to={text(
						'To Address',
						'bitcoincash:qrh335l4sn9rhr8jk23zympmvfud07lttufc7l6qdy'
					)}
					successFn={() => console.log('success')}
					failFn={() => console.log('fail')}
				/>
			</div>
		),
		{
			notes: 'Pay in any currency, and automagically convert the amount to BCH',
		}
	)
	.add(
		'optionally satoshis',
		() => (
			<div style={{ display: 'flex' }}>
				<BadgerBadge
					price={0.01}
					to={text(
						'To Address',
						'bitcoincash:qrh335l4sn9rhr8jk23zympmvfud07lttufc7l6qdy'
					)}
					showSatoshis={boolean('Show Satoshis', false)}
					successFn={() => console.log('success')}
					failFn={() => console.log('fail')}
				/>
			</div>
		),
		{
			notes: 'Choose to show the Satoshi amount alongside the currency amount',
		}
	)
	.add(
		'optionally badger info',
		() => (
			<div style={{ display: 'flex' }}>
				<BadgerBadge
					price={0.01}
					to={text(
						'To Address',
						'bitcoincash:qrh335l4sn9rhr8jk23zympmvfud07lttufc7l6qdy'
					)}
					showBrand={boolean('Badger info', false)}
					successFn={() => console.log('success')}
					failFn={() => console.log('fail')}
				/>
			</div>
		),
		{
			notes: 'Choose to display a link to the Badger homepage',
		}
	)
	.add(
		'payment functions',
		() => (
			<div style={{ display: 'flex' }}>
				<BadgerBadge
					price={0.001}
					to={text(
						'To Address',
						'bitcoincash:qrh335l4sn9rhr8jk23zympmvfud07lttufc7l6qdy'
					)}
					successFn={() => alert('Custom Success function called')}
					failFn={() => alert('Custom Fail / Cancel function called ')}
				/>
			</div>
		),
		{
			notes: 'Custom functions called on Successfull and Failed payments',
		}
	);
