/**
* Get the most frequent entry (mode) in a array of numbers
*
* @param array - The array to check
*/
export default function (array: number[]): number | null {
  if (array.length === 0) {
    return null;
  }

  const modeMap = {};
  let maxEl = array[0];
  let maxCount = 1;

  for (let i = 0; i < array.length; i += 1) {
    const el = array[i];

    if (modeMap[el] == null) {
      modeMap[el] = 1;
    } else {
      modeMap[el] += 1;
    }

    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }

  return maxEl;
}
