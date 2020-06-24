/**
 * Formats the name of the icon adding, if appropiate,
 * the size, a prefix and a suffix.
 */
export default function (
  name: string, size: string, userValues: UserValues, index?: number
): string {
  const prefix = userValues.prefix.replace(/\$n/, index ? index.toString() : '1').replace(/\$s/, size);
  const suffix = userValues.suffix.replace(/\$n/, index ? index.toString() : '1').replace(/\$s/, size);

  switch (userValues.sizeMethod) {
    default:
    case 'not':
      return `${prefix}${name}${suffix}`;
    case 'beginning':
      return `${size} / ${prefix}${name}${suffix}`;
    case 'end':
      return `${prefix}${name}${suffix} / ${size}`;
    case 'appendix':
      return `${prefix}${name}${suffix}-${size}`;
  }
}
