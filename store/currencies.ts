export const CURRENCIES = [
    {code: 'GBP', name: 'British Pound', symbol: '£'},
    {code: 'EUR', name: 'Euro', symbol: '€'},
    {code: 'USD', name: 'US Dollar', symbol: '$'},
    {code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$'},
    {code: 'AUD', name: 'Australian Dollar', symbol: 'A$'},
    {code: 'JPY', name: 'Japanese Yen', symbol: '¥'},
    {code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM'},
];

export const LOCALE_CURRENCY_MAP: Record<string, string> = {
    "en-GB": "GBP",
    "en-US": "USD",
    "de-DE": "EUR",
    "fr-FR": "EUR",
    "it-IT": "EUR",
    "es-ES": "EUR",
    "ja-JP": "JPY",
    "en-AU": "AUD",
    "en-CA": "CAD",
    "ms-MY": "MYR"
};

export const CURRENCY_CODES = CURRENCIES.map(c => c.code);