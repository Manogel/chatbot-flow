import { MyConnectionNode, MyMessageNode } from '../../initial-elements';

export type ISelectOptions = {
  id: string;
  value: string;
  message: string;
};

export type ConnectionEdgeSideControlsProps = {
  messageNodes: MyMessageNode[];
  onDelete: (connectionId: string) => void;
  onUpdate: (connection: MyConnectionNode) => void;
};
export type ConnectionEdgeSideControlsRef = {
  openToEdit(data: MyConnectionNode): void;
};
