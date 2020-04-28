interface ErrorEntry {
  id: string | string[];
  name: string;
  type: string;
}

type AllowedNodes = FrameNode | ComponentNode;

interface FindNodes {
  duplicates: boolean;
  nodes: AllowedNodes[] | AllowedNodes[][];
}

interface UserSettings {
  start: string;
  end: string;
  size: string;
}
