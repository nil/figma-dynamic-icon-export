interface ErrorEntry {
  id: string | string[];
  name: string;
  type: string;
}

type AllowedNodes = FrameNode | ComponentNode;

interface UserValues {
  sizeValue: string;
  sizeMethod: 'not' | 'beginning' | 'end' | 'appendix';
  prefix: string;
  suffix: string;
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
  values: UserValues;
}
