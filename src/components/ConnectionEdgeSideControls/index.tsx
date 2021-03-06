import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  FormEventHandler,
  useCallback,
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
import {
  ConnectionEdgeSideControlsProps,
  ConnectionEdgeSideControlsRef,
  ISelectOptions,
} from './types';
import { MyConnectionNode } from '../../types';

const INITIAL_FORM_DATA = {
  mustBeEqualTo: '',
  messageIfAnswerIsInvalidId: 'custom',
  customMessageIfAnswerIsInvalid: '',
};

const ConnectionEdgeSideControls = forwardRef<
  ConnectionEdgeSideControlsRef,
  ConnectionEdgeSideControlsProps
>(({ messageNodes, onDelete, onUpdate }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [connectionElement, setConnectionElement] = useState<MyConnectionNode>(
    {} as MyConnectionNode
  );
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
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

  const handleInputChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const formatValue = type === 'checkbox' ? checked : value;

    setFormData((state) => ({ ...state, [name]: formatValue }));
  }, []);

  const handleUpdateConnection: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!connectionElement.data) return;
    const messageIfAnswerIsInvalidId =
      formData.messageIfAnswerIsInvalidId !== 'custom'
        ? formData.messageIfAnswerIsInvalidId || ''
        : undefined;

    onUpdate({
      ...connectionElement,
      data: {
        ...connectionElement.data,
        ...formData,
        messageIfAnswerIsInvalidId,
      },
    });

    setFormData(INITIAL_FORM_DATA);
    onClose();
  };

  const handleDeleteConnection = () => {
    onDelete(connectionElement.id);
    setFormData(INITIAL_FORM_DATA);
    onClose();
  };

  const handleSelectMessage = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const optionSelected = selectMessageOptions.find(
        (optionItem) => optionItem.id === e.target.value
      );
      setFormData((prevState) => ({
        ...prevState,
        messageIfAnswerIsInvalidId: e.target.value,
        customMessageIfAnswerIsInvalid: optionSelected?.message || '',
      }));
    },
    [selectMessageOptions]
  );

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="md"
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Configura????es entre n??s
        </DrawerHeader>

        <DrawerBody>
          <form id="form-connection" onSubmit={handleUpdateConnection}>
            <Stack spacing="24px">
              <FormControl htmlFor="mustBeEqualTo" isRequired>
                <FormLabel htmlFor="mustBeEqualTo">
                  A resposta deve ser igual a:
                </FormLabel>
                <Input
                  id="mustBeEqualTo"
                  name="mustBeEqualTo"
                  placeholder="Informe o texto"
                  onChange={handleInputChange}
                  value={formData.mustBeEqualTo}
                  isRequired
                />
              </FormControl>
              <FormControl htmlFor="messageIfAnswerIsInvalidId" isRequired>
                <FormLabel htmlFor="messageIfAnswerIsInvalidId">
                  Se a resposta n??o for v??lida, ent??o envia uma mensagem:
                </FormLabel>
                <Select
                  id="messageIfAnswerIsInvalidId"
                  name="messageIfAnswerIsInvalidId"
                  defaultValue={formData.messageIfAnswerIsInvalidId}
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

              <FormControl htmlFor="customMessageIfAnswerIsInvalid" isRequired>
                <FormLabel htmlFor="customMessageIfAnswerIsInvalid">
                  Informe a mensagem
                </FormLabel>
                <Textarea
                  id="customMessageIfAnswerIsInvalid"
                  name="customMessageIfAnswerIsInvalid"
                  placeholder="Ex: Desculpe n??o conseguimos processar sua resposta"
                  isDisabled={formData.messageIfAnswerIsInvalidId !== 'custom'}
                  value={formData.customMessageIfAnswerIsInvalid}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Stack>
          </form>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button
            variant="outline"
            colorScheme="red"
            mr="auto"
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
