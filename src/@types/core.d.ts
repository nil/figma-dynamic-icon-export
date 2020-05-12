interface ErrorEntry {
  id: string | string[];
  name: string;
  type: string;
}

type AllowedNodes = FrameNode | ComponentNode;

interface UserSettings {
  size: string;
  sizeExplicit: boolean;
  sizeUnits: boolean;
  sizeName: 'beginning' | 'end' | 'appendix';
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
