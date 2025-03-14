# Currency Support

Bordful supports 50 of the most common currencies worldwide for job postings. This document explains how to use and configure currencies in your job board.

## Supported Currencies

The system supports 50 currencies, including:

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

For a complete list, see the `lib/constants/currencies.ts` file.

## How Currencies Work

### In Job Listings

Job listings can specify salaries in any of the supported currencies. The system will:

1. Display the correct currency symbol
2. Format the numbers appropriately
3. Convert to a normalized value (in USD) for sorting and filtering

### Configuration Options

In your `config.ts` file, you can configure currency-related settings:

```typescript
currency: {
  // Default currency code used when no currency is specified
  defaultCurrency: "USD",
  
  // Allowed currencies for job listings
  // Set to null to allow all currencies, or specify a subset
  allowedCurrencies: ["USD", "EUR", "GBP"],
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

The system can also handle plain currency codes ("USD") or currency names ("United States Dollar"), but the combined format is recommended for clarity.

## Extending Currency Support

If you need to add new currencies:

1. Add the currency code, name, and symbol to `lib/constants/currencies.ts`
2. Add an appropriate exchange rate in the `CURRENCY_RATES` object

## Currency Conversion

The system includes approximate exchange rates for normalizing salaries for comparison and sorting. These rates are fixed and intended for relative comparison only, not for financial calculations.

For accurate, real-time currency conversion, you may want to integrate with a currency exchange rate API.

```typescript
// Example of adding a new currency
const CURRENCY_RATES: Record<CurrencyCode, number> = {
  // Existing currencies...
  USD: 1.00,
  EUR: 1.10,
  // Your new currency
  XYZ: 0.75, // Exchange rate relative to USD
};
``` 