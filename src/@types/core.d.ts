interface ErrorEntry {
  id: string | string[];
  name: string;
  type: string;
}

interface FindFrames {
  duplicates: boolean;
  frames: FrameNode[] | FrameNode[][];
}

interface UserSettings {
  start: string;
  end: string;
  size: string;
}
