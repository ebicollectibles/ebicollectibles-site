import { RARITY_NAME } from './rarityNames'

/**
 * A rarity code shown on its own ("SAR", "AR") with its full name attached,
 * so it is not just a string of letters to a screen reader or to a reader
 * new to the hobby. Anything that is not a known code is shown as it is.
 */
export function RarityAbbr({ code }: { code: string }) {
  const name = RARITY_NAME[code]
  return name ? <abbr title={name}>{code}</abbr> : <>{code}</>
}

/** The full rarity name for alt text: "SAR" -> "Special Art Rare". Full names pass through. */
export function rarityFullName(codeOrName: string): string {
  return RARITY_NAME[codeOrName] ?? codeOrName.replace(/\s*\([A-Z0-9]+\)\s*$/, '')
}
