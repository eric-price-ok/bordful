// Currency constants and utilities

// Currency type definition - 50 common currencies
export type CurrencyCode =
  | "USD"
  | "EUR"
  | "JPY"
  | "GBP"
  | "AUD"
  | "CAD"
  | "CHF"
  | "CNY"
  | "SEK"
  | "NZD"
  | "MXN"
  | "SGD"
  | "HKD"
  | "NOK"
  | "KRW"
  | "TRY"
  | "RUB"
  | "INR"
  | "BRL"
  | "ZAR"
  | "PHP"
  | "CZK"
  | "IDR"
  | "MYR"
  | "HUF"
  | "ISK"
  | "BGN"
  | "THB"
  | "ILS"
  | "CLP"
  | "NGN"
  | "COP"
  | "PKR"
  | "BDT"
  | "VND"
  | "EGP"
  | "PEN"
  | "KWD"
  | "SAR"
  | "ARS"
  | "UAH"
  | "RON"
  | "DKK"
  | "PLN"
  | "QAR"
  | "BHD"
  | "OMR"
  | "JOD";

// Export a list of all currency codes for programmatic use
export const CURRENCY_CODES: CurrencyCode[] = [
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
  "SEK",
  "NZD",
  "MXN",
  "SGD",
  "HKD",
  "NOK",
  "KRW",
  "TRY",
  "RUB",
  "INR",
  "BRL",
  "ZAR",
  "PHP",
  "CZK",
  "IDR",
  "MYR",
  "HUF",
  "ISK",
  "BGN",
  "THB",
  "ILS",
  "CLP",
  "NGN",
  "COP",
  "PKR",
  "BDT",
  "VND",
  "EGP",
  "PEN",
  "KWD",
  "SAR",
  "ARS",
  "UAH",
  "RON",
  "DKK",
  "PLN",
  "QAR",
  "BHD",
  "OMR",
  "JOD",
];

// Currency information structure
export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
}

// Full currency data with names and symbols
export const CURRENCIES: Currency[] = [
  { name: "United States Dollar", symbol: "$", code: "USD" },
  { name: "Euro", symbol: "€", code: "EUR" },
  { name: "Japanese Yen", symbol: "¥", code: "JPY" },
  { name: "British Pound Sterling", symbol: "£", code: "GBP" },
  { name: "Australian Dollar", symbol: "$", code: "AUD" },
  { name: "Canadian Dollar", symbol: "$", code: "CAD" },
  { name: "Swiss Franc", symbol: "CHF", code: "CHF" },
  { name: "Chinese Yuan Renminbi", symbol: "¥", code: "CNY" },
  { name: "Swedish Krona", symbol: "kr", code: "SEK" },
  { name: "New Zealand Dollar", symbol: "$", code: "NZD" },
  { name: "Mexican Peso", symbol: "$", code: "MXN" },
  { name: "Singapore Dollar", symbol: "$", code: "SGD" },
  { name: "Hong Kong Dollar", symbol: "$", code: "HKD" },
  { name: "Norwegian Krone", symbol: "kr", code: "NOK" },
  { name: "South Korean Won", symbol: "₩", code: "KRW" },
  { name: "Turkish Lira", symbol: "₺", code: "TRY" },
  { name: "Russian Ruble", symbol: "₽", code: "RUB" },
  { name: "Indian Rupee", symbol: "₹", code: "INR" },
  { name: "Brazilian Real", symbol: "R$", code: "BRL" },
  { name: "South African Rand", symbol: "R", code: "ZAR" },
  { name: "Philippine Peso", symbol: "₱", code: "PHP" },
  { name: "Czech Koruna", symbol: "Kč", code: "CZK" },
  { name: "Indonesian Rupiah", symbol: "Rp", code: "IDR" },
  { name: "Malaysian Ringgit", symbol: "RM", code: "MYR" },
  { name: "Hungarian Forint", symbol: "Ft", code: "HUF" },
  { name: "Icelandic Krona", symbol: "kr", code: "ISK" },
  { name: "Bulgarian Lev", symbol: "лв", code: "BGN" },
  { name: "Thai Baht", symbol: "฿", code: "THB" },
  { name: "Israeli New Shekel", symbol: "₪", code: "ILS" },
  { name: "Chilean Peso", symbol: "$", code: "CLP" },
  { name: "Nigerian Naira", symbol: "₦", code: "NGN" },
  { name: "Colombian Peso", symbol: "$", code: "COP" },
  { name: "Pakistani Rupee", symbol: "Rs.", code: "PKR" },
  { name: "Bangladeshi Taka", symbol: "Tk", code: "BDT" },
  { name: "Vietnamese Dong", symbol: "₫", code: "VND" },
  { name: "Egyptian Pound", symbol: "£", code: "EGP" },
  { name: "Peruvian Sol", symbol: "S/", code: "PEN" },
  { name: "Kuwaiti Dinar", symbol: "د.ك", code: "KWD" },
  { name: "Saudi Riyal", symbol: "ر.س", code: "SAR" },
  { name: "Argentine Peso", symbol: "$", code: "ARS" },
  { name: "Ukrainian Hryvnia", symbol: "₴", code: "UAH" },
  { name: "Romanian Leu", symbol: "lei", code: "RON" },
  { name: "Danish Krone", symbol: "kr", code: "DKK" },
  { name: "Polish Zloty", symbol: "zł", code: "PLN" },
  { name: "Qatari Riyal", symbol: "ر.ق", code: "QAR" },
  { name: "Bahraini Dinar", symbol: ".د.ب", code: "BHD" },
  { name: "Omani Rial", symbol: "ر.ع.", code: "OMR" },
  { name: "Jordanian Dinar", symbol: "د.ا", code: "JOD" },
];

// Currency lookup map for quick access
export const CURRENCY_MAP: Record<CurrencyCode, Currency> = CURRENCIES.reduce(
  (acc, currency) => {
    acc[currency.code] = currency;
    return acc;
  },
  {} as Record<CurrencyCode, Currency>
);

// Get currency by code
export function getCurrencyByCode(code: string): Currency | undefined {
  if (CURRENCY_CODES.includes(code as CurrencyCode)) {
    return CURRENCY_MAP[code as CurrencyCode];
  }
  return undefined;
}

// Get currency by name
export function getCurrencyByName(name: string): Currency | undefined {
  return CURRENCIES.find(
    (currency) => currency.name.toLowerCase() === name.toLowerCase()
  );
}

// Get symbol for currency code
export function getCurrencySymbol(code: CurrencyCode): string {
  return CURRENCY_MAP[code]?.symbol || code;
}

// Approximate exchange rates for normalizing salaries
// These are simplified rates for comparison purposes only
// In a production app, you would use a real-time exchange rate API
export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1.0, // Base currency
  EUR: 1.1,
  JPY: 0.0067,
  GBP: 1.27,
  AUD: 0.66,
  CAD: 0.74,
  CHF: 1.13,
  CNY: 0.14,
  SEK: 0.095,
  NZD: 0.6,
  MXN: 0.06,
  SGD: 0.74,
  HKD: 0.13,
  NOK: 0.094,
  KRW: 0.00075,
  TRY: 0.031,
  RUB: 0.011,
  INR: 0.012,
  BRL: 0.18,
  ZAR: 0.055,
  PHP: 0.018,
  CZK: 0.043,
  IDR: 0.000064,
  MYR: 0.22,
  HUF: 0.0028,
  ISK: 0.0072,
  BGN: 0.56,
  THB: 0.028,
  ILS: 0.27,
  CLP: 0.0011,
  NGN: 0.00068,
  COP: 0.00025,
  PKR: 0.0036,
  BDT: 0.0091,
  VND: 0.00004,
  EGP: 0.021,
  PEN: 0.27,
  KWD: 3.26,
  SAR: 0.27,
  ARS: 0.0011,
  UAH: 0.025,
  RON: 0.22,
  DKK: 0.15,
  PLN: 0.25,
  QAR: 0.27,
  BHD: 2.65,
  OMR: 2.6,
  JOD: 1.41,
};
