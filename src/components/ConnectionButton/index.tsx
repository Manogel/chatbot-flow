import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  getEdgeCenter,
  getMarkerEnd,
} from 'react-flow-renderer';
import { Flex, Button } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

const foreignObjectSize = 40;

interface ConnectionButtonParams extends EdgeProps {}

const ConnectionButton: React.FC<ConnectionButtonParams> = (edgeParams) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    arrowHeadType,
    markerEndId,
  } = edgeParams;
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: '2px' }}
        strokeWidth={4}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Flex flexDirection="row">
          <Button className="edgebutton">
            <SettingsIcon color="blue.400" />
          </Button>
        </Flex>
      </foreignObject>
    </>
  );
};

export default ConnectionButton;
