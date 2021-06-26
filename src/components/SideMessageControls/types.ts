import { MyMessageNode } from '../../initial-elements';

export type SideMessageControlsRef = {
  openToEdit(data: MyMessageNode): void;
};

export type SideMessageControlsProps = {
  onAddNode: (messageNode: MyMessageNode) => void;
  onUpdate: (messageNode: MyMessageNode) => void;
  onDelete: (messageId: string) => void;
};
