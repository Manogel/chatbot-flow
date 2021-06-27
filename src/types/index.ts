import { Edge, Node } from 'react-flow-renderer';

export enum INodeType {
  NODE = 'node',
  CONNECTION = 'connection',
}

export type IEdge = {
  id: string;
  type: INodeType;
};

export type INode = IEdge & {
  title: string;
  message: string;
  isFinalFlow?: boolean;
  isEntryFlow?: boolean;
};

export type IConnection = IEdge & {
  mustBeEqualTo: string;
  messageIfAnswerIsInvalidId?: string;
  customMessageIfAnswerIsInvalid?: string;
  source: string;
  target: string;
};

export type MyMessageNode = Node<INode>;
export type MyConnectionNode = Edge<IConnection>;
