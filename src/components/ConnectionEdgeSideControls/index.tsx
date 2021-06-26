import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  FormEventHandler,
} from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  FormLabel,
  Input,
  useDisclosure,
  Select,
  Textarea,
  DrawerFooter,
  Button,
  FormControl,
} from '@chakra-ui/react';
import { MyConnectionNode } from '../../initial-elements';
import {
  ConnectionEdgeSideControlsProps,
  ConnectionEdgeSideControlsRef,
  ISelectOptions,
} from './types';

const ConnectionEdgeSideControls = forwardRef<
  ConnectionEdgeSideControlsRef,
  ConnectionEdgeSideControlsProps
>(({ messageNodes, onDelete, onUpdate }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [connectionElement, setConnectionElement] = useState<MyConnectionNode>(
    {} as MyConnectionNode
  );
  const [command, setCommand] = useState('');
  const [invalidMessage, setInvalidMessage] = useState('');
  const [invalidMessageType, setInvalidMessageType] = useState('custom');
  const [selectMessageOptions, setSelectMessageOptions] = useState<
    ISelectOptions[]
  >([]);

  useEffect(() => {
    setSelectMessageOptions([
      {
        id: 'custom',
        value: 'Customizada',
        message: '',
      },
      ...messageNodes.map((nodeItem) => ({
        id: nodeItem.id,
        value: nodeItem.data?.title || '',
        message: nodeItem.data?.message || '',
      })),
    ]);
  }, [messageNodes]);

  useImperativeHandle(
    ref,
    () => {
      const handleEditConnection = (data: MyConnectionNode) => {
        setConnectionElement(data);
        onOpen();
      };

      return {
        openToEdit: handleEditConnection,
      };
    },
    [onOpen]
  );

  const handleUpdateConnection: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onClose();
  };

  const handleDeleteConnection = () => {
    onDelete(connectionElement.id);
    onClose();
  };

  const handleSelectMessage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInvalidMessageType(e.target.value);
    const optionSelected = selectMessageOptions.find(
      (optionItem) => optionItem.id === e.target.value
    );

    setInvalidMessage(optionSelected?.message || '');
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Configurações entre nós
        </DrawerHeader>

        <DrawerBody>
          <form id="form-connection" onSubmit={handleUpdateConnection}>
            <Stack spacing="24px">
              <FormControl htmlFor="command" isRequired>
                <FormLabel htmlFor="command">
                  A resposta deve ser igual a:
                </FormLabel>
                <Input
                  id="command"
                  placeholder="Informe o commando"
                  onChange={(e) => setCommand(e.target.value)}
                  value={command}
                  isRequired
                />
              </FormControl>
              <FormControl htmlFor="message-invalid" isRequired>
                <FormLabel htmlFor="message-invalid">
                  Se a resposta não for válida, então envia uma mensagem:
                </FormLabel>
                <Select
                  id="message-invalid"
                  defaultValue={invalidMessageType}
                  onChange={handleSelectMessage}
                  isRequired
                >
                  {selectMessageOptions.map((optionItem) => (
                    <option key={optionItem.id} value={optionItem.id}>
                      {optionItem.value}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl htmlFor="message-text" isRequired>
                <FormLabel htmlFor="message-text">Informe a mensagem</FormLabel>
                <Textarea
                  id="message-text"
                  placeholder="Ex: Resposta inválida"
                  isDisabled={invalidMessageType !== 'custom'}
                  value={invalidMessage}
                  onChange={(e) => setInvalidMessage(e.target.value)}
                />
              </FormControl>
            </Stack>
          </form>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button
            variant="outline"
            colorScheme="red"
            mr={3}
            onClick={handleDeleteConnection}
          >
            Excluir
          </Button>
          <Button colorScheme="blue" type="submit" form="form-connection">
            Salvar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});

export default ConnectionEdgeSideControls;
