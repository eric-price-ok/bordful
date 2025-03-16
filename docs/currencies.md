# Currency Support

Bordful supports a wide range of currencies worldwide for job postings, including traditional fiat currencies and cryptocurrencies. This document explains how to use and configure currencies in your job board.

## Supported Currencies

### Fiat Currencies

The system supports traditional fiat currencies, including:

- USD (United States Dollar)
- EUR (Euro)
- GBP (British Pound Sterling)
- JPY (Japanese Yen)
- AUD (Australian Dollar)
- CAD (Canadian Dollar)
- CHF (Swiss Franc)
- CNY (Chinese Yuan Renminbi)
- SEK (Swedish Krona)
- NZD (New Zealand Dollar)
- MXN (Mexican Peso)
- SGD (Singapore Dollar)
- HKD (Hong Kong Dollar)
- NOK (Norwegian Krone)
- KRW (South Korean Won)
- TRY (Turkish Lira)
- RUB (Russian Ruble)
- INR (Indian Rupee)
- BRL (Brazilian Real)
- ZAR (South African Rand)
- PHP (Philippine Peso)
- CZK (Czech Koruna)
- IDR (Indonesian Rupiah)
- MYR (Malaysian Ringgit)
- HUF (Hungarian Forint)
- ISK (Icelandic Krona)
- BGN (Bulgarian Lev)
- THB (Thai Baht)
- ILS (Israeli New Shekel)
- CLP (Chilean Peso)
- NGN (Nigerian Naira)
- COP (Colombian Peso)
- PKR (Pakistani Rupee)
- BDT (Bangladeshi Taka)
- VND (Vietnamese Dong)
- EGP (Egyptian Pound)
- PEN (Peruvian Sol)
- KWD (Kuwaiti Dinar)
- SAR (Saudi Riyal)
- ARS (Argentine Peso)
- UAH (Ukrainian Hryvnia)
- RON (Romanian Leu)
- DKK (Danish Krone)
- PLN (Polish Zloty)
- QAR (Qatari Riyal)
- BHD (Bahraini Dinar)
- OMR (Omani Rial)
- JOD (Jordanian Dinar)

### Cryptocurrencies

The system also supports cryptocurrencies, including:

#### Stablecoins (USD-pegged)
- USDT (Tether USD)
- USDC (USD Coin)
- USDS (USDS Stablecoin)
- PYUSD (PayPal USD)
- TUSD (True USD)

#### Major Cryptocurrencies
- BTC (Bitcoin)
- ETH (Ethereum)
- XRP (Ripple)
- BNB (BNB)
- SOL (Solana)
- ADA (Cardano)
- DOGE (Dogecoin)
- TRX (Tron)
- XLM (Stellar)
- AVAX (Avalanche)
- SHIB (Shiba Inu)
- LTC (Litecoin)
- BCH (Bitcoin Cash)
- DOT (Polkadot)
- XMR (Monero)

For a complete list, see the `lib/constants/currencies.ts` file.

## How Currencies Work

### In Job Listings

Job listings can specify salaries in any of the supported currencies. The system will:

1. Display the correct currency symbol
2. Format the numbers appropriately
3. Convert to a normalized value (in USD) for sorting and filtering

### Cryptocurrency Display

Stablecoins (like USDT, USDC) use the dollar symbol ($) but display their currency code (e.g., $50,000/year (USDT)) to differentiate them from USD.

Major cryptocurrencies display with their own symbols (₿ for Bitcoin, Ξ for Ethereum) or with the dollar symbol and their currency code for others.

### Configuration Options

In your `config.ts` file, you can configure currency-related settings:

```typescript
currency: {
  // Default currency code used when no currency is specified
  defaultCurrency: "USD",
  
  // Allowed currencies for job listings
  // Set to null to allow all currencies, or specify a subset
  allowedCurrencies: ["USD", "EUR", "GBP", "USDT", "USDC", "BTC", "ETH"],
},
```

### Pricing Page

For the pricing page, you can configure the display currency:

```typescript
pricing: {
  // Other pricing configuration...
  
  // Currency for pricing display
  currency: "USD",
  
  // Currency symbol is derived automatically
},
```

## Setting Up in Airtable

In your Airtable base, make sure you have a `salary_currency` field that accepts one of the valid currency codes.

### Recommended Format

The recommended format for currency options in Airtable is:

```
USD (United States Dollar)
EUR (Euro)
JPY (Japanese Yen)
GBP (British Pound Sterling)
USDT (Tether USD)
USDC (USD Coin)
BTC (Bitcoin)
ETH (Ethereum)
```

This format:
1. Is user-friendly in the Airtable interface
2. Will be correctly parsed by the application
3. Provides context for users creating job listings

### Airtable Field Configuration

For the `salary_currency` field:
- **Field Type**: Single select dropdown
- **Default Value**: USD (recommended)
- **Options**: Add options in the format shown above for all currencies you want to support

The system can handle plain currency codes ("USD", "USDT", "BTC") or currency names ("United States Dollar", "Tether USD", "Bitcoin"), but the combined format is recommended for clarity.

## Extending Currency Support

If you need to add new currencies:

1. Add the currency code, name, and symbol to `lib/constants/currencies.ts`
2. Add an appropriate exchange rate in the `CURRENCY_RATES` object

## Currency Conversion

The system includes approximate exchange rates for normalizing salaries for comparison and sorting. These rates are fixed and intended for relative comparison only, not for financial calculations.

For cryptocurrencies, the rates are particularly simplified and should be updated periodically to reflect current market values.

For accurate, real-time currency conversion, you may want to integrate with a currency exchange rate API.

```typescript
// Example of adding a new cryptocurrency
const CURRENCY_RATES: Record<CurrencyCode, number> = {
  // Existing currencies...
  USD: 1.00,
  USDT: 1.00, // Stablecoins pegged to USD
  BTC: 83000, // Approximate BTC/USD rate
  // Your new cryptocurrency
  XYZ: 123.45, // Exchange rate relative to USD
};
``` 