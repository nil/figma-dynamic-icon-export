// Custom types
interface ErrorEntry {
  id: string;
  name: string;
  type: string;
}

interface FindFrames {
  duplicates: boolean;
  frames: FrameNode[];
}

interface NameData {
  sizeExpression: string;
  sizes: number[];
  name: string;
  id: string | undefined;
  fullName: string[];
  fullNameMark: string[];
  fullNameId: string[] | undefined;
}
