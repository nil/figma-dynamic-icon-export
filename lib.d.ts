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

interface PluginData {
  start: string;
  end: string;
  size: string;
  regexSizes: RegExp;
  regexName: RegExp;
}
