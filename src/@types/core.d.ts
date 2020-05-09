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
  size: string;
}

interface SelectedNode {
  name: string;
  id: string;
  type: string;
  size: number;
  status: boolean;
}

interface ExportNodes {
  nodes: string[];
  size: string;
}
