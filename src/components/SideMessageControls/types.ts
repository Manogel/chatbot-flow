import { MyMessageNode } from '../../initial-elements';

export type SideMessageControlsRef = {
  openToEdit(data: MyMessageNode): void;
};

export type SideMessageControlsProps = {
  onAddNode: (node: MyMessageNode) => void;
};
