import { MyMessageNode } from '../../types';

export type SideMessageControlsRef = {
  openToEdit(data: MyMessageNode): void;
};

export type SideMessageControlsProps = {
  onAddNode: (messageNode: MyMessageNode) => Promise<void>;
  onUpdate: (messageNode: MyMessageNode) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
};
