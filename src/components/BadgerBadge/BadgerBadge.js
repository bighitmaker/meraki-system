// @flow

import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import {
	buildPriceEndpoint,
	getCurrencyPreSymbol,
	getCurrencyPostSymbol,
	formatPriceDisplay,
	getSatoshiDisplayValue,
} from '../../utils/badger-helpers';

import BitcoinCashImage from '../../images/bitcoin-cash.svg';
import colors from '../../styles/colors';

import Button from '../../atoms/Button';

const PRICE_UPDATE_INTERVAL = 60 * 1000;
// TODO - Import custom FA icon as needed, don't pull in whole thing

const Main = styled.div`
	font-family: sans-serif;
	display: grid;
	grid-gap: 24px;
	padding: 12px 12px 6px;
	border: 1px dashed ${(props) => (props.color3 ? props.color3 : colors.bchGrey)};
	border-radius: 4px;
	background-color: ${(props) => (props.color2 ? props.color2 : 'inherit')};
	color: ${(props) => (props.color3 ? props.color3 : 'inherit')};
`;

const ButtonText = styled.p`
	font-size: 20px;
	line-height: 1.2em;
	margin: 0;
`;


const Prices = styled.div`
	display: grid;
	grid-template-columns: max-content max-content;
	grid-gap: 5px;
	align-items: end;
	justify-content: end;
`;
const PriceText = styled.p`
	font-family: monospace;
	font-size: 18px;
	line-height: 1em;
	margin: 0;
`;

const HeaderText = styled.h3`
	text-align: center;
	font-size: 28px;
	line-height: 1em;
	margin: 0;
	font-weight: 400;
`;


const Loader = styled.div`
	height: 20px;
	width: 100%;
	background-color: ${colors.fg};
	border-radius: 10px;
	display: flex;
	overflow: hidden;
`;

const CompleteCircle = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${colors.brand500};
	color: ${colors.bg};
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

const ButtonContainer = styled.div`
	min-height: 40px;
	display: grid;
	grid-gap: 7px;
	align-items: center;
	justify-content: flex-end;
	width: 100%;
	background-color: mistyrose;
`;

const BrandBottom = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const A = styled.a`
	color: ${(props) => (props.color3 ? props.color3 : colors.bchGrey)};
	text-decoration: none;
	&:hover {
		color: ${(props) => (props.color1 ? props.color1 : colors.brand500)};
	}
`;

type FillerProps = {};
type FillerState = { width: number };

class Filler extends React.Component<FillerProps, FillerState> {
	constructor(props) {
		super(props);
		this.state = { width: 1 };
	}

	componentDidMount() {
		setTimeout(() => this.setState({ width: 100 }), 250);
	}
	render() {
		const { width } = this.state;
		return <FillerDiv width={width} />;
	}
}

// Currency endpoints, logic, and formatters
type CurrencyCode = 'USD' | 'CAD' | 'HKD' | 'JPY' | 'GBP' | 'EUR' | 'CNY';

// Main Badger Button
type Props = {
	to: string,
	text?: string,
	tag: string,
	price: number,
	showSatoshis?: boolean,
	showBrand?: boolean,
	currency: CurrencyCode,

	color1?: string,
	color2?: string,
	color3?: string,

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
		tag: 'Donate BCH',
		showBrand: true,
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
					successFn(res);
					this.setState({ step: 'complete' });
				}
			});
		} else {
			window.open('https://badger.bitcoin.com');
		}
	};

	componentDidMount() {
		const currency = this.props.currency;

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
		const {
			text,
			price,
			currency,
			showSatoshis,
			tag,
			showBrand,
			color1,
			color2,
			color3,
		} = this.props;

		const priceInCurrency = BCHPrice[currency] && BCHPrice[currency].price;

		return (
			<Main color1={color1} color2={color2} color3={color3}>
				<HeaderText>{text}</HeaderText>
				<Prices>
					<PriceText style={{ textAlign: 'right'}}>
						{getCurrencyPreSymbol(currency)}
						{formatPriceDisplay(price)} {getCurrencyPostSymbol(currency)}{' '}
					</PriceText>
					<Small>{currency}</Small>
					{showSatoshis && (
						<>
							<PriceText>
								<img src={BitcoinCashImage} style={{ height: 14 }} alt="BCH" />{' '}
								{getSatoshiDisplayValue(priceInCurrency, price)}
							</PriceText>
							<Small>BCH</Small>
						</>
					)}
				</Prices>
				<ButtonContainer>
					{step === 'fresh' ? (
						<Button onClick={this.handleClick} color1={color1} color2={color2}>
							<ButtonText>
								{tag}
							</ButtonText>
						</Button>
					) : step === 'pending' ? (
						<Loader>
							<Filler />
						</Loader>
					) : (
						<CompleteCircle>
							<FontAwesomeIcon icon={faCheck} />
						</CompleteCircle>
					)}
					{showBrand && (<BrandBottom>
						<Small>
							<A
								href="badger.bitcoin.com"
								target="_blank"
								color1={color1}
								color3={color3}
							>
								About Badger
							</A>
						</Small>
					</BrandBottom>)}
				</ButtonContainer>
			</Main>
		);
	}
}

export default BadgerButton;
