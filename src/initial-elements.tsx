import { Edge, FlowElement } from 'react-flow-renderer';

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
  messageIfAnswerIsInvalidId: string;
  customMessageIfAnswerIsInvalid?: string;
  source: string;
  target: string;
};

export type MyMessageNode = FlowElement<INode>;
export type MyConnectionNode = Edge<IConnection>;

export const defaultNodeStyles = {
  strokeWidth: '10px',
  border: '2px solid #777',
  padding: 10,
  borderRadius: '2px',
};

const initialElements: MyMessageNode[] = [
  {
    id: '1',
    type: 'boxText',
    position: { x: 250, y: 0 },
    style: defaultNodeStyles,
    data: {
      id: '1',
      type: INodeType.NODE,
      title: 'Menu Principal',
      isEntryFlow: true,
      message: 'Envie uma mensagem',
    },
  },
  // {
  //   id: '2',
  //   data: {
  //     label: (
  //       <>
  //         This is a <strong>default node</strong>
  //       </>
  //     ),
  //   },
  //   position: { x: 100, y: 100 },
  // },
  // {
  //   id: '3',
  //   data: {
  //     label: (
  //       <>
  //         This one has a <strong>custom style</strong>
  //       </>
  //     ),
  //   },
  //   position: { x: 400, y: 100 },
  //   style: {
  //     background: '#D6D5E6',
  //     color: '#333',
  //     border: '1px solid #222138',
  //     width: 180,
  //   },
  // },
  // {
  //   id: '4',
  //   position: { x: 250, y: 200 },
  //   data: {
  //     label: 'Another default node',
  //   },
  // },
  // {
  //   id: '5',
  //   type: 'boxText',
  //   data: {
  //     label: 'Node id: 5',
  //   },
  //   position: { x: 250, y: 325 },
  // },
  // {
  //   id: '6',
  //   type: 'output',
  //   data: {
  //     label: (
  //       <>
  //         An <strong>output node</strong>
  //       </>
  //     ),
  //   },
  //   position: { x: 100, y: 480 },
  // },
  // {
  //   id: '7',
  //   type: 'output',
  //   data: { label: 'Another output node' },
  //   position: { x: 400, y: 450 },
  // },
  // { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  // { id: 'e1-3', source: '1', target: '3' },
  // {
  //   id: 'e3-4',
  //   source: '3',
  //   target: '4',
  //   animated: true,
  //   label: 'animated edge',
  // },
  // {
  //   id: 'e4-5',
  //   source: '4',
  //   target: '5',
  //   arrowHeadType: ArrowHeadType.ArrowClosed,
  //   label: 'edge with arrow head',
  // },
  // {
  //   id: 'e5-6',
  //   source: '5',
  //   target: '6',
  //   type: 'smoothstep',
  //   label: 'smooth step edge',
  // },
  // {
  //   id: 'e5-7',
  //   source: '5',
  //   target: '7',
  //   type: 'step',
  //   style: { stroke: '#f6ab6c', strokeWidth: '10px' },
  //   label: 'a step edge',
  //   animated: true,
  //   labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  // },
];

export default initialElements;
