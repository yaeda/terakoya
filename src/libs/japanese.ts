/**
 * Converts a string of Katakana characters to Hiragana characters.
 *
 * This function takes a string containing Katakana characters and converts
 * each character to its corresponding Hiragana character. It uses Unicode
 * character codes to perform the conversion.
 *
 * @param src - The input string containing Katakana characters.
 * @returns A new string with the Katakana characters converted to Hiragana.
 */
export const kata2hira = (src: string) => {
  return src.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

/**
 * Converts a string of Hiragana characters to Katakana characters.
 *
 * @param src - The input string containing Hiragana characters.
 * @returns A new string where all Hiragana characters have been converted to Katakana.
 */
export const hira2kata = (src: string) => {
  return src.replace(/[\u3041-\u3096]/g, function (match) {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
};
