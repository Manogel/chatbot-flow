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

import { INodeType, MyConnectionNode, MyMessageNode } from './types';
import ChatbotFlowService from './service/ChatbotFlowService';

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
  const [messageNodes, setMessageNodes] = useState<MyMessageNode[]>([]);

  useEffect(() => {
    const fetchElements = async () => {
      const elementsData = await ChatbotFlowService.findAll();
      const connections: MyConnectionNode[] = [];
      const nodes: MyMessageNode[] = [];

      elementsData.forEach((elementItem) => {
        if (elementItem.extendsData.type === INodeType.NODE) {
          nodes.push(elementItem.extendsData as MyMessageNode);
        } else {
          connections.push(elementItem.extendsData as MyConnectionNode);
        }
      });

      setConnectionNodes(connections);
      setMessageNodes(nodes);
    };
    fetchElements();
  }, []);

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
    console.log(connectionData);
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

  const handleAddNode = useCallback(async (node: MyMessageNode) => {
    await ChatbotFlowService.createMessageNode({
      extendsData: node,
      id: node.id,
      isEntryFlow: !!node.data?.isEntryFlow,
      isFinalFlow: !!node.data?.isFinalFlow,
      message: node.data?.message || '',
      title: node.data?.title || '',
    });

    setMessageNodes((prevState) => [...prevState, node]);
  }, []);

  const handleUpdateConnection = useCallback(
    async (connection: MyConnectionNode) => {
      const response = await ChatbotFlowService.createOrUpdateConnectionNode({
        extendsData: connection,
        id: connection.id,
        mustBeEqualTo: connection.data?.mustBeEqualTo || '',
        customMessageIfAnswerIsInvalid:
          connection.data?.customMessageIfAnswerIsInvalid,
        messageIfAnswerIsInvalidId: connection.data?.messageIfAnswerIsInvalidId,
        source: connection.source,
        target: connection.target,
      });
      console.log(response);

      setConnectionNodes((prevState) => {
        const newList = prevState.map((nodeItem) => ({
          ...nodeItem,
          data: nodeItem.id !== connection.id ? nodeItem.data : connection.data,
        }));

        return newList;
      });
    },
    []
  );

  const handleDeleteConnection = useCallback(async (connectionId: string) => {
    setConnectionNodes((prevState) =>
      prevState.filter((nodeItem) => nodeItem.id !== connectionId)
    );
  }, []);

  const handleUpdateMessage = useCallback(async (message: MyMessageNode) => {
    await ChatbotFlowService.updateMessageNode({
      extendsData: message,
      id: message.id,
      isEntryFlow: !!message.data?.isEntryFlow,
      isFinalFlow: !!message.data?.isFinalFlow,
      message: message.data?.message || '',
      title: message.data?.title || '',
    });

    setMessageNodes((prevState) =>
      prevState.map((nodeItem) => ({
        ...nodeItem,
        data: nodeItem.id !== message.id ? nodeItem.data : message.data,
      }))
    );
  }, []);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
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

    setMessageNodes((prevSate) => {
      const newList = prevSate.map((nodeItem) => ({
        ...nodeItem,
        position: nodeItem.id === String(id) ? position : nodeItem.position,
      }));
      return newList;
    });
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
