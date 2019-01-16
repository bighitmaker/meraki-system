import React from 'react'
import styled from 'styled-components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

import {
  buildPriceEndpoint,
  getCurrencyPreSymbol,
  getCurrencyPostSymbol,
  formatPriceDisplay
} from '../../utils/badger-helpers';

import BitcoinCashImage from '../../images/bitcoin-cash.svg'
import colors from '../../styles/colors';

// TODO - Import custom FA icon as needed, don't pull in whole thing

const BadgerText = styled.p`
  font-size: 18px;
  line-height: 1.5em;
  margin: 0;
`

const BButton = styled.button`
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: ${props => (props.color2 ? props.color2 : colors.bg)};
  border: 2px solid
    ${props => (props.color1 ? props.color1 : colors.bchOrange)};
  padding: 6px 10px;
  color: ${props => (props.color1 ? props.color1 :colors.bchOrange)};
  &:hover {
    background-color: ${props =>
      props.color1 ? props.color1 : colors.bchOrange};
    color: ${props => (props.color2 ? props.color2 : colors.bg)};
  }
  }
`
const Loader = styled.div`
  height: 20px;
  width: 100%;
  background-color: ${colors.fg};
  border-radius: 10px;
  display: flex;
  overflow: hidden;
`

const CompleteCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.bchOrange};
  color: ${colors.bg};
`

const FillerDiv = styled.div`
  width: ${props => props.width}%;
  background-color: ${colors.bchOrange};
  transition: 3s all ease;
`

const Small = styled.span`
  font-size: 12px;
  font-weight: 700;
`

const Main = styled.div`
  display: grid;
  grid-gap: 12px;
  padding: 15px 8px 6px;
  border: 2px solid
    ${props => (props.color3 ? props.color3 : colors.bchGrey)};
  border-radius: 7px;
  background-color: ${props => (props.color2 ? props.color2 : 'inherit')};
  color: ${props => (props.color3 ? props.color3 : 'inherit')};

  background-color: red;
`

const Prices = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 5px;
  align-items: end;
  justify-content: end;
`
const PriceText = styled.p`
  font-size: 18px;
  line-height: 18px;
  margin: 0;
`

const HeaderText = styled.h3`
  font-size: 24px;
  line-height: 24px;
  margin: 0;
  font-weight: 400;
`
const ButtonContainer = styled.div`
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const BrandBottom = styled.div``

const A = styled.a`
  color: ${props => (props.color3 ? props.color3 : colors.bchGrey)};
  text-decoration: none;
  &:hover {
    color: ${props => (props.color1 ? props.color1 : colors.bchOrange)};
  }
`

class Filler extends React.Component {
  constructor(props) {
    super(props)
    this.state = { width: 1 }
  }
  componentDidMount() {
    setTimeout(() => this.setState({ width: 100 }), 250)
  }
  render() {
    const { width } = this.state
    return <FillerDiv width={width} />
  }
}


// Main Badger Button
// TODO - Re-add flow to library, or TS
// type Props = {
//   to: string,
//   text?: string,
//   tag: string,
//   price: number,
//   showSatoshis?: boolean,
//   showBrand?: boolean,
//   currency: CurrencyCode,

//   color1?: string,
//   color2?: string,
//   color3?: string,

//   successFn: Function,
//   failFn?: Function,
// }
// type State = {
//   step: 'fresh' | 'pending' | 'complete',
//   BCHPrice: {
//     [currency: CurrencyCode]: {
//       price: ?number,
//       stamp: ?number,
//     },
//   },
// }

class BadgerButton extends React.Component {
  static defaultProps = {
    currency: 'USD',
    showSatoshis: true,
    tag: 'Donate BCH',
    showBrand: true,
  }

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      step: 'fresh',
      BCHPrice: {},
    }

    this.updateBCHPrice = this.updateBCHPrice.bind(this)
  }

  componentDidMount() {
    const currency = this.props.currency

    // Get price on load, and update price every minute
    this.updateBCHPrice(currency)
    this.priceInterval = setInterval(
      () => this.updateBCHPrice(currency),
      1000 * 60
    )
  }

  componentWillUnmount() {
    this.priceInterval && clearInterval(this.priceInterval)
  }

  async updateBCHPrice(currency) {
    const priceRequest = await fetch(buildPriceEndpoint(currency))
    const result = await priceRequest.json()

    const { price, stamp } = result
    this.setState({
      BCHPrice: { [currency]: { price, stamp } },
    })
  }

  handleClick() {
    const { to, successFn, failFn, currency, price } = this.props
    const { BCHPrice } = this.state

    const priceInCurrency = BCHPrice[currency].price
    if (!priceInCurrency) {
      this.updateBCHPrice(currency)
      return
    }

    const singleDollarValue = priceInCurrency / 100
    const singleDollarSatoshis = 100000000 / singleDollarValue
    const satoshis = price * singleDollarSatoshis

    if (window && typeof window.Web4Bch !== 'undefined') {
      const { web4bch } = window
      const web4bch2 = new window.Web4Bch(web4bch.currentProvider)

      const txParams = {
        to,
        from: web4bch2.bch.defaultAccount,
        value: satoshis,
      }

      this.setState({ step: 'pending' })

      web4bch2.bch.sendTransaction(txParams, (err, res) => {
        if (err) {
          console.log('BadgerButton send cancel', err)
          failFn && failFn(err)
          this.setState({ step: 'fresh' })
        } else {
          console.log('BadgerButton send success:', res)
          successFn(res)
          this.setState({ step: 'complete' })
        }
      })
    } else {
      window.open('https://badger.bitcoin.com')
    }
  }

  render() {
    const { step, BCHPrice } = this.state
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
    } = this.props

    const priceInCurrency = BCHPrice[currency] && BCHPrice[currency].price

    let satoshiDisplay = '----'
    if (priceInCurrency) {
      const singleDollarValue = priceInCurrency / 100
      const singleDollarSatoshis = 100000000 / singleDollarValue
      satoshiDisplay = (
        Math.trunc(price * singleDollarSatoshis) / 100000000
      ).toFixed(8)
    }

    return (
      <Main color1={color1} color2={color2} color3={color3}>
        <HeaderText>{text}</HeaderText>
        <Prices>
          <PriceText style={{ textAlign: 'right', lineHeight: '' }}>
            {getCurrencyPreSymbol(currency)} {formatPriceDisplay(price)}{' '}
            {getCurrencyPostSymbol(currency)}{' '}
          </PriceText>
          <Small>{currency}</Small>
          {showSatoshis && (
            <>
              <PriceText>
                <img src={BitcoinCashImage} style={{ height: 14 }} alt="BCH" />{' '}
                {satoshiDisplay}{' '}
              </PriceText>
              <Small>BCH</Small>
            </>
          )}
        </Prices>
        <ButtonContainer>
          {step === 'fresh' ? (
            <BButton onClick={this.handleClick} color1={color1} color2={color2}>
              <BadgerText style={{ lineHeight: '1.2em', fontSize: 18 }}>
                {tag}
              </BadgerText>
            </BButton>
          ) : step === 'pending' ? (
            <Loader>
              <Filler />
            </Loader>
          ) : (
            <CompleteCircle>
              <FontAwesomeIcon icon={faCheck} />
            </CompleteCircle>
          )}
        </ButtonContainer>
        {showBrand && (
          <BrandBottom>
            <Small>
              <A
                href="badger.bitcoin.com"
                target="_blank"
                color1={color1}
                color3={color3}
              >
                badger.bitcoin.com
              </A>
            </Small>
          </BrandBottom>
        )}
      </Main>
    )
  }
}

export default BadgerButton
