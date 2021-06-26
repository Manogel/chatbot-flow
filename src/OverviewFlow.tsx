import { useEffect, useMemo, useState, useCallback, createRef } from 'react';

import ReactFlow, {
  addEdge,
  Controls,
  Background,
  OnLoadFunc,
  Connection,
  Edge,
  ArrowHeadType,
} from 'react-flow-renderer';
import { useDebouncedCallback } from 'use-debounce';
import ConnectionButton from './components/ConnectionButton';
import { ConnectionEdgeSideControlsRef } from './components/ConnectionEdgeSideControls/types';
import ConnectionLine from './components/ConnectionLine';
import MessageNodeBox from './components/MessageNodeBox';
import SideMessageControls from './components/SideMessageControls';
import ConnectionEdgeSideControls from './components/ConnectionEdgeSideControls';
import { SideMessageControlsRef } from './components/SideMessageControls/types';

import initialElements, {
  INodeType,
  MyConnectionNode,
  MyMessageNode,
} from './initial-elements';

const nodeTypes = {
  boxText: MessageNodeBox,
};

const edgeTypes = {
  buttonedge: ConnectionButton,
};

const onLoad: OnLoadFunc<any> | undefined = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

const OverviewFlow = () => {
  const sideMessageSideRef = createRef<SideMessageControlsRef>();
  const connectionEdgeSideRef = createRef<ConnectionEdgeSideControlsRef>();
  const [connectionNodes, setConnectionNodes] = useState<MyConnectionNode[]>(
    []
  );
  const [messageNodes, setMessageNodes] =
    useState<MyMessageNode[]>(initialElements);

  const onConnect = (data: Edge | Connection) => {
    const params = data as MyConnectionNode;
    params.arrowHeadType = ArrowHeadType.ArrowClosed;
    const id = `connection-${params.target}-${params.source}`;
    const connectionData = {
      ...params,
      type: 'buttonedge',
      id,
      data: {
        id,
        type: INodeType.CONNECTION,
      },
    } as MyConnectionNode;

    connectionEdgeSideRef.current?.openToEdit(connectionData);
    setConnectionNodes(
      (els) => addEdge(connectionData, els) as MyConnectionNode[]
    );
  };

  const handleOpenToEditConnectionNode = useCallback(
    (connectionData: Edge) => {
      connectionEdgeSideRef.current?.openToEdit(connectionData);
    },
    [connectionEdgeSideRef]
  );
  const handleOpenToEditMessageNode = useCallback(
    (connectionData: MyMessageNode) => {
      sideMessageSideRef.current?.openToEdit(connectionData);
    },
    [sideMessageSideRef]
  );

  const handleAddNode = useCallback((node: MyMessageNode) => {
    setMessageNodes((prevState) => [...prevState, node]);
  }, []);

  const handleUpdateConnection = useCallback((connection: MyConnectionNode) => {
    setConnectionNodes((prevState) =>
      prevState.map((nodeItem) =>
        nodeItem.id !== connection.id ? nodeItem : connection
      )
    );
  }, []);

  const handleDeleteConnection = useCallback((connectionId: string) => {
    setConnectionNodes((prevState) =>
      prevState.filter((nodeItem) => nodeItem.id !== connectionId)
    );
  }, []);

  const handleUpdateMessage = useCallback((message: MyMessageNode) => {
    setMessageNodes((prevState) =>
      prevState.map((nodeItem) =>
        nodeItem.id !== message.id ? nodeItem : message
      )
    );
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessageNodes((prevState) =>
      prevState.filter((nodeItem) => nodeItem.id !== messageId)
    );
    setConnectionNodes((prevState) =>
      prevState.filter(
        (nodeItem) =>
          nodeItem.target !== messageId && nodeItem.source !== messageId
      )
    );
  }, []);

  const handleMessageBoxMove = useDebouncedCallback((value: MyMessageNode) => {
    const { id, position } = value;

    setMessageNodes((prevSate) =>
      prevSate.map((nodeItem) => ({
        ...nodeItem,
        position: nodeItem.id === id ? position : nodeItem.position,
      }))
    );
  }, 1500);

  const elements = useMemo(
    () => [...connectionNodes, ...messageNodes],
    [connectionNodes, messageNodes]
  );

  useEffect(() => {
    console.log(elements);
  }, [elements]);

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      onLoad={onLoad}
      nodeTypes={nodeTypes}
      onEdgeDoubleClick={(_, edge) => handleOpenToEditConnectionNode(edge)}
      onNodeDoubleClick={(_, node) => handleOpenToEditMessageNode(node)}
      edgeTypes={edgeTypes}
      snapToGrid={true}
      snapGrid={[15, 15]}
      connectionLineComponent={ConnectionLine}
      onNodeMouseMove={(_e, node) => handleMessageBoxMove(node)}
    >
      <Controls />
      <Background color="#aaa" gap={16} />
      <SideMessageControls
        ref={sideMessageSideRef}
        onAddNode={handleAddNode}
        onUpdate={handleUpdateMessage}
        onDelete={handleDeleteMessage}
      />
      <ConnectionEdgeSideControls
        onUpdate={handleUpdateConnection}
        onDelete={handleDeleteConnection}
        ref={connectionEdgeSideRef}
        messageNodes={messageNodes}
      />
    </ReactFlow>
  );
};

export default OverviewFlow;
