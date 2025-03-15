type ParsedToken = {
  text: string;
  ruby?: string;
  isBlank: boolean;
  hint?: string;
};

/**
 * Parses the input string and returns an array of ParsedToken objects.
 * The input string can contain various patterns such as blanks with hints,
 * ruby annotations, and plain text.
 *
 * The supported patterns are:
 * - `[[blank:hint]]` or `[[blank]]`
 * - `{{blank:hint}}` or `{{blank}}`
 * - `rubytarget((rubytext))` or `((rubytarget:rubytext))`
 *
 * @param input - The input string to be parsed.
 * @returns An array of ParsedToken objects representing the parsed tokens.
 */
export const parse = (input: string): ParsedToken[] => {
  const regex =
    /\[\[(?<blank1>.*?):+(?<hint1>.*?)\]\]|\[\[(?<blank2>.*?)\]\]|\{\{(?<blank3>.*?):+(?<hint3>.*?)\}\}|\{\{(?<blank4>.*?)\}\}|\(\((?<rubytarget>[一-龥々]+):+(?<rubytext>.*?)\)\)/g;
  const result: ParsedToken[] = [];

  const matches = input.matchAll(regex);

  let curIndex = 0;
  for (const match of matches) {
    const text = input.substring(curIndex, match.index);
    if (text) {
      result.push({ text, isBlank: false });
    }

    const blank =
      match.groups?.blank1 ||
      match.groups?.blank2 ||
      match.groups?.blank3 ||
      match.groups?.blank4;
    const hint = match.groups?.hint1 || match.groups?.hint3;
    const rubytarget = match.groups?.rubytarget;
    const rubytext = match.groups?.rubytext;

    if (blank) {
      result.push({ text: blank, isBlank: true, hint });
      curIndex = match.index + match[0].length;
    }

    if (rubytarget && rubytext) {
      result.push({
        text: rubytarget,
        ruby: rubytext,
        isBlank: false,
      });
      curIndex = match.index + match[0].length;
    }
  }

  // rest
  const text = input.substring(curIndex);
  if (text) {
    result.push({ text, isBlank: false });
  }

  return result;
};
