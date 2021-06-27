import { MyConnectionNode, MyMessageNode } from '../../types';

export type ISelectOptions = {
  id: string;
  value: string;
  message: string;
};

export type ConnectionEdgeSideControlsProps = {
  messageNodes: MyMessageNode[];
  onDelete: (connectionId: string) => Promise<void>;
  onUpdate: (connection: MyConnectionNode) => Promise<void>;
};
export type ConnectionEdgeSideControlsRef = {
  openToEdit(data: MyConnectionNode): void;
};
