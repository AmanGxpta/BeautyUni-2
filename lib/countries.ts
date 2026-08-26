/**
 * Dialling codes for the phone field's country picker.
 *
 * The table is keyed by ISO 3166-1 alpha-2 rather than by dialling code
 * because dialling codes are not unique — +1 alone covers the US, Canada and
 * twenty Caribbean states — so a `<select>` whose values were dialling codes
 * would have colliding options. The ISO code picks the country; the dialling
 * code is what gets stored on the signup.
 *
 * Flags are derived rather than pasted in: an ISO code maps one-to-one onto a
 * pair of Unicode regional indicators, so `IN` *is* 🇮🇳. That keeps the table
 * to the three facts that actually vary and leaves no flag to fall out of sync
 * with its country.
 */

export type Country = {
  /** ISO 3166-1 alpha-2, e.g. `IN`. The value the `<select>` posts. */
  iso: string;
  /** E.164 country calling code, with its `+`, e.g. `+91`. */
  dial: string;
  name: string;
  /** Regional-indicator flag, e.g. 🇮🇳. */
  flag: string;
};

/** The default selection — this is a seminar series run in India. */
export const DEFAULT_COUNTRY_ISO = "IN";

const REGIONAL_INDICATOR_A = 0x1f1e6;
const LATIN_A = "A".charCodeAt(0);

function flagOf(iso: string): string {
  return String.fromCodePoint(
    ...[...iso].map((letter) => REGIONAL_INDICATOR_A + letter.charCodeAt(0) - LATIN_A),
  );
}

/** `ISO dial Name`, one country per entry — see the note above on why it is this shape. */
const TABLE = `
AF 93 Afghanistan|AX 358 Åland Islands|AL 355 Albania|DZ 213 Algeria|AS 1 American Samoa|AD 376 Andorra|AO 244 Angola|AI 1 Anguilla|AG 1 Antigua and Barbuda|AR 54 Argentina|AM 374 Armenia|AW 297 Aruba|AU 61 Australia|AT 43 Austria|AZ 994 Azerbaijan|
BS 1 Bahamas|BH 973 Bahrain|BD 880 Bangladesh|BB 1 Barbados|BY 375 Belarus|BE 32 Belgium|BZ 501 Belize|BJ 229 Benin|BM 1 Bermuda|BT 975 Bhutan|BO 591 Bolivia|BA 387 Bosnia and Herzegovina|BW 267 Botswana|BR 55 Brazil|BN 673 Brunei|BG 359 Bulgaria|BF 226 Burkina Faso|BI 257 Burundi|
KH 855 Cambodia|CM 237 Cameroon|CA 1 Canada|CV 238 Cape Verde|KY 1 Cayman Islands|CF 236 Central African Republic|TD 235 Chad|CL 56 Chile|CN 86 China|CO 57 Colombia|KM 269 Comoros|CG 242 Congo|CD 243 Congo (DRC)|CK 682 Cook Islands|CR 506 Costa Rica|CI 225 Côte d'Ivoire|HR 385 Croatia|CU 53 Cuba|CW 599 Curaçao|CY 357 Cyprus|CZ 420 Czechia|
DK 45 Denmark|DJ 253 Djibouti|DM 1 Dominica|DO 1 Dominican Republic|
EC 593 Ecuador|EG 20 Egypt|SV 503 El Salvador|GQ 240 Equatorial Guinea|ER 291 Eritrea|EE 372 Estonia|SZ 268 Eswatini|ET 251 Ethiopia|
FO 298 Faroe Islands|FJ 679 Fiji|FI 358 Finland|FR 33 France|GF 594 French Guiana|PF 689 French Polynesia|
GA 241 Gabon|GM 220 Gambia|GE 995 Georgia|DE 49 Germany|GH 233 Ghana|GI 350 Gibraltar|GR 30 Greece|GL 299 Greenland|GD 1 Grenada|GP 590 Guadeloupe|GU 1 Guam|GT 502 Guatemala|GG 44 Guernsey|GN 224 Guinea|GW 245 Guinea-Bissau|GY 592 Guyana|
HT 509 Haiti|HN 504 Honduras|HK 852 Hong Kong|HU 36 Hungary|
IS 354 Iceland|IN 91 India|ID 62 Indonesia|IR 98 Iran|IQ 964 Iraq|IE 353 Ireland|IM 44 Isle of Man|IL 972 Israel|IT 39 Italy|
JM 1 Jamaica|JP 81 Japan|JE 44 Jersey|JO 962 Jordan|
KZ 7 Kazakhstan|KE 254 Kenya|KI 686 Kiribati|KW 965 Kuwait|KG 996 Kyrgyzstan|
LA 856 Laos|LV 371 Latvia|LB 961 Lebanon|LS 266 Lesotho|LR 231 Liberia|LY 218 Libya|LI 423 Liechtenstein|LT 370 Lithuania|LU 352 Luxembourg|
MO 853 Macao|MG 261 Madagascar|MW 265 Malawi|MY 60 Malaysia|MV 960 Maldives|ML 223 Mali|MT 356 Malta|MH 692 Marshall Islands|MQ 596 Martinique|MR 222 Mauritania|MU 230 Mauritius|MX 52 Mexico|FM 691 Micronesia|MD 373 Moldova|MC 377 Monaco|MN 976 Mongolia|ME 382 Montenegro|MS 1 Montserrat|MA 212 Morocco|MZ 258 Mozambique|MM 95 Myanmar|
NA 264 Namibia|NR 674 Nauru|NP 977 Nepal|NL 31 Netherlands|NC 687 New Caledonia|NZ 64 New Zealand|NI 505 Nicaragua|NE 227 Niger|NG 234 Nigeria|NU 683 Niue|KP 850 North Korea|MK 389 North Macedonia|NO 47 Norway|
OM 968 Oman|
PK 92 Pakistan|PW 680 Palau|PS 970 Palestine|PA 507 Panama|PG 675 Papua New Guinea|PY 595 Paraguay|PE 51 Peru|PH 63 Philippines|PL 48 Poland|PT 351 Portugal|PR 1 Puerto Rico|
QA 974 Qatar|
RE 262 Réunion|RO 40 Romania|RU 7 Russia|RW 250 Rwanda|
BL 590 Saint Barthélemy|KN 1 Saint Kitts and Nevis|LC 1 Saint Lucia|MF 590 Saint Martin|VC 1 Saint Vincent and the Grenadines|WS 685 Samoa|SM 378 San Marino|ST 239 São Tomé and Príncipe|SA 966 Saudi Arabia|SN 221 Senegal|RS 381 Serbia|SC 248 Seychelles|SL 232 Sierra Leone|SG 65 Singapore|SX 1 Sint Maarten|SK 421 Slovakia|SI 386 Slovenia|SB 677 Solomon Islands|SO 252 Somalia|ZA 27 South Africa|KR 82 South Korea|SS 211 South Sudan|ES 34 Spain|LK 94 Sri Lanka|SD 249 Sudan|SR 597 Suriname|SE 46 Sweden|CH 41 Switzerland|SY 963 Syria|
TW 886 Taiwan|TJ 992 Tajikistan|TZ 255 Tanzania|TH 66 Thailand|TL 670 Timor-Leste|TG 228 Togo|TO 676 Tonga|TT 1 Trinidad and Tobago|TN 216 Tunisia|TR 90 Türkiye|TM 993 Turkmenistan|TC 1 Turks and Caicos Islands|TV 688 Tuvalu|
UG 256 Uganda|UA 380 Ukraine|AE 971 United Arab Emirates|GB 44 United Kingdom|US 1 United States|UY 598 Uruguay|UZ 998 Uzbekistan|
VU 678 Vanuatu|VA 39 Vatican City|VE 58 Venezuela|VN 84 Vietnam|VG 1 Virgin Islands (British)|VI 1 Virgin Islands (U.S.)|
YE 967 Yemen|ZM 260 Zambia|ZW 263 Zimbabwe
`;

export const COUNTRIES: readonly Country[] = TABLE.split("|")
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const [iso, dial, ...name] = entry.split(" ");
    return { iso, dial: `+${dial}`, name: name.join(" "), flag: flagOf(iso) };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

const BY_ISO = new Map(COUNTRIES.map((country) => [country.iso, country]));

/**
 * The country behind a posted `countryIso`, or `undefined` if it isn't one of
 * ours. The one place an ISO code off the wire becomes a `Country`.
 */
export function findCountry(iso: unknown): Country | undefined {
  return typeof iso === "string" ? BY_ISO.get(iso.toUpperCase()) : undefined;
}
