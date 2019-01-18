// @flow
import * as React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import {
	buildPriceEndpoint,
	getCurrencyPreSymbol,
	getCurrencyPostSymbol,
	getSatoshiDisplayValue,
	formatPriceDisplay,
} from '../../utils/badger-helpers';

import colors from '../../styles/colors';
import BitcoinCashLogoImage from '../../images/bitcoin-cash-logo.svg';
import BitcoinCashImage from '../../images/bitcoin-cash.svg';

import Button from '../../atoms/Button';

const PRICE_UPDATE_INTERVAL = 60 * 1000;

const BadgerText = styled.p`
	font-size: 18px;
	line-height: 1.5em;
	margin: 0;
`;

const SatoshiText = styled.p`
	font-size: 12px;
	margin: 3px 0 0 0;
	display: grid;
	grid-template-columns: max-content max-content max-content;
	justify-content: end;
	grid-gap: 5px;
	align-items: center;
`;

const Loader = styled.div`
	height: 20px;
	width: 75%;
	background-color: ${colors.fg100};
	border-radius: 10px;
	display: flex;
	overflow: hidden;
`;

const CompleteCircle = styled.div`
	width: 50px;
	height: 50px;
	border-radius: 25px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${colors.brand500};
	color: ${(props) => props.theme.bg};
`;

const FillerDiv = styled.div`
	width: ${(props) => props.width}%;
	background-color: ${colors.brand500};
	transition: 3s all ease;
`;

const Small = styled.span`
	font-size: 12px;
	font-weight: 700;
`;

const Wrapper = styled.div`
	display: grid;
	font-family: sans-serif;
	grid-template-columns: max-content;
	grid-template-rows: max-content max-content;
	color: ${colors.bchGrey};
`;

// Currency endpoints, logic, and formatters
type CurrencyCode = 'USD' | 'CAD' | 'HKD' | 'JPY' | 'GBP' | 'EUR' | 'CNY';

// Badger Badge Props
type Props = {
	to: string,
	price: number,
	currency: CurrencyCode,

	text?: string,
	showSatoshis?: boolean,
	showBrand?: boolean,
	children: React.Node,

	successFn: Function,
	failFn?: Function,
};
type State = {
	step: 'fresh' | 'pending' | 'complete',
	BCHPrice: {
		[currency: CurrencyCode]: {
			price: ?number,
			stamp: ?number,
		},
	},
};

class BadgerButton extends React.Component<Props, State> {
	static defaultProps = {
		currency: 'USD',
		showSatoshis: true,
		text: 'Payment Total',
	};

	state = {
		step: 'fresh',
		BCHPrice: {},
	};

	updateBCHPrice = async (currency: CurrencyCode) => {
		const priceRequest = await fetch(buildPriceEndpoint(currency));
		const result = await priceRequest.json();

		const { price, stamp } = result;
		this.setState({
			BCHPrice: { [currency]: { price, stamp } },
		});
	};

	handleClick = () => {
		const { to, successFn, failFn, currency, price } = this.props;
		const { BCHPrice } = this.state;

		const priceInCurrency = BCHPrice[currency].price;
		if (!priceInCurrency) {
			this.updateBCHPrice(currency);
			return;
		}

		const singleDollarValue = priceInCurrency / 100;
		const singleDollarSatoshis = 100000000 / singleDollarValue;
		const satoshis = price * singleDollarSatoshis;

		if (window && typeof window.Web4Bch !== 'undefined') {
			const { web4bch } = window;
			const web4bch2 = new window.Web4Bch(web4bch.currentProvider);

			const txParams = {
				to,
				from: web4bch2.bch.defaultAccount,
				value: satoshis,
			};

			this.setState({ step: 'pending' });

			web4bch2.bch.sendTransaction(txParams, (err, res) => {
				if (err) {
					console.log('BadgerButton send cancel', err);
					failFn && failFn(err);
					this.setState({ step: 'fresh' });
				} else {
					console.log('BadgerButton send success:', res);
					this.setState({ step: 'complete' });
					successFn(res);
				}
			});
		} else {
			window.open('https://badger.bitcoin.com');
		}
	};

	componentDidMount() {
		const { currency } = this.props;

		// Get price on load, and update price every minute
		this.updateBCHPrice(currency);
		this.priceInterval = setInterval(
			() => this.updateBCHPrice(currency),
			PRICE_UPDATE_INTERVAL
		);
	}

	componentWillUnmount() {
		this.priceInterval && clearInterval(this.priceInterval);
	}

	componentDidUpdate(prevProps: Props) {
		const { currency } = this.props;
		const prevCurrency = prevProps.currency;

		// Clear previous price interval, set a new one, and immediately update price
		if (currency !== prevCurrency) {
			this.priceInterval && clearInterval(this.priceInterval);
			this.priceInterval = setInterval(
				() => this.updateBCHPrice(currency),
				PRICE_UPDATE_INTERVAL
			);
			this.updateBCHPrice(currency);
		}
	}

	render() {
		const { step, BCHPrice } = this.state;
		const { text, price, currency, showSatoshis, children } = this.props;

		const priceInCurrency = BCHPrice[currency] && BCHPrice[currency].price;

		return (
			<Wrapper>
				<Button onClick={this.handleClick} step={step}>
					{children || (
						<BadgerText style={{ lineHeight: '1.3em' }}>{text}</BadgerText>
					)}
					<BadgerText style={{ lineHeight: '1.2em', fontSize: 24 }}>
						{getCurrencyPreSymbol(currency)} {formatPriceDisplay(price)}
						{getCurrencyPostSymbol(currency)} <Small> {currency}</Small>
					</BadgerText>
				</Button>
				{showSatoshis && (
					<SatoshiText>
						<img src={BitcoinCashImage} style={{ height: 14 }} alt="BCH" /> BCH{' '}
						{getSatoshiDisplayValue(priceInCurrency, price)}
					</SatoshiText>
				)}
			</Wrapper>
		);
	}
}

export default BadgerButton;
