export const startMark = '$';
export const endMark = ' ';
export const sizeMark = ',';
export const idMark = ';';


export default function (name: string): NameData {
  const pattern = new RegExp(`(?:\\${startMark})?(.*?)\\${endMark}(?:\\/ )?(.*?)(?:\\${idMark}|$)(.*)`, 'i');
  const chopped = name.match(pattern);
  const sizes = chopped[1].split(sizeMark).map((size) => parseFloat(size));

  const fullName = sizes.map((size) => `${size}${endMark}/ ${chopped[2]}`);
  const fullNameMark = fullName.map((nameItem) => `${startMark}${nameItem}`);
  const fullNameId = fullNameMark.map((nameItem) => `${nameItem}${idMark}${chopped[3]}`);

  return {
    sizeExpression: chopped[1],
    sizes,
    name: chopped[2],
    id: chopped[3],

    fullName,
    fullNameMark,
    fullNameId: chopped[3] ? fullNameId : undefined
  };
}
