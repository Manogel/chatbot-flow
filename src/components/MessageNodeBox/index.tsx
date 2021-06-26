import { memo } from 'react';
import { Stack, Container, Text } from '@chakra-ui/react';
import { Handle, Position } from 'react-flow-renderer';
import { MyMessageNode } from '../../initial-elements';
import renderIf from '../../utils/renderIf';

const defaultDotSizeStyle = {
  width: '10px',
  height: '10px',
  background: '#346adf',
};

const MessageNodeBox = ({ data }: MyMessageNode) => {
  if (!data) return null;

  return (
    <>
      {renderIf(
        <Handle
          type="target"
          position={Position.Top}
          style={{ ...defaultDotSizeStyle, background: '#e62d4f' }}
        />,
        !data.isEntryFlow
      )}

      <Container backgroundColor="white" borderRadius="md">
        <Stack spacing={3}>
          <Text>{data.title}</Text>
        </Stack>
        {renderIf(
          <Handle
            type="source"
            position={Position.Bottom}
            style={defaultDotSizeStyle}
          />,
          !data.isFinalFlow
        )}
      </Container>
    </>
  );
};

export default memo(MessageNodeBox);
