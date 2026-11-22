// The business details printed in the footer of every list email (restock
// and new release emails). CAN-SPAM requires the sender's valid physical
// postal address in commercial email: a street address, a USPS PO box, or a
// registered private mailbox all qualify. Order and shipping emails don't
// need it.
//
// List emails must not be sent while the address is empty: see
// marketingEmailExtras in server/email.ts, which refuses to build a footer
// without it.
export const BUSINESS_LEGAL_NAME = 'EBI Collectibles'
export const BUSINESS_POSTAL_ADDRESS: string | null = '17701 108th Ave SE Ste 202, Renton, WA 98055'
