// Custom types
interface ErrorEntry {
  id: string | string[];
  name: string;
  type: string;
}

interface FindFrames {
  duplicates: boolean;
  frames: FrameNode[] | FrameNode[][];
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

interface UserSettings {
  start: string;
  end: string;
  size: string;
}
