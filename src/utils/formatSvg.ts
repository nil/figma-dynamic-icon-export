/**
 * Format the svg to remove various
 * attributes and merge all paths
 *
 * @param unit8 - Svg code as a Unit8 array
 */
export default function (unit8: Uint8Array): string {
  const svg = String.fromCharCode.apply(null, new Uint8Array(unit8))
    .replace(/fill="(.*?)"\s?/gmi, '')
    .replace(/clip-rule="(.*?)"\s?/gmi, '')
    .replace(/<svg(.*)\n/gmi, '$&\t');

  if (/fill-rule/.test(svg)) {
    return svg.replace(/" \/>\n<path (fill-rule="evenodd" )?d="/gmi, ' ')
      .replace(/path d/gmi, 'path fill-rule="evenodd" d');
  }

  return svg;
}
