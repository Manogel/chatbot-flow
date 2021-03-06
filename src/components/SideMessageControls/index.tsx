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
  Textarea,
  DrawerFooter,
  Button,
  Checkbox,
  FormControl,
} from '@chakra-ui/react';
import { useCallback, useImperativeHandle, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AddIcon } from '@chakra-ui/icons';
import { defaultNodeStyles } from '../../initial-elements';
import { FormEventHandler } from 'react';
import { forwardRef } from 'react';
import renderIf from '../../utils/renderIf';
import { SideMessageControlsProps, SideMessageControlsRef } from './types';
import { INodeType, MyMessageNode } from '../../types';

const INITIAL_FORM_DATA = {
  title: '',
  message: '',
  isFinalFlow: false,
};

const SideMessageControls = forwardRef<
  SideMessageControlsRef,
  SideMessageControlsProps
>(({ onAddNode, onUpdate, onDelete }, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageNodeEdit, setMessageNodeEdit] = useState<
    MyMessageNode | undefined
  >();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useImperativeHandle(
    ref,
    () => {
      const handleEditConnection = (data: MyMessageNode) => {
        setMessageNodeEdit(data);
        setFormData({
          title: data.data?.title || '',
          message: data.data?.message || '',
          isFinalFlow: !!data.data?.isFinalFlow,
        });
        onOpen();
      };

      return {
        openToEdit: handleEditConnection,
      };
    },
    [onOpen]
  );

  const handleSaveMessageNode: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const submitFn = messageNodeEdit
      ? handleUpdateMessageNode
      : handleCreateMessageNode;

    submitFn();
    handleClose();
  };

  const handleUpdateMessageNode = useCallback(() => {
    if (!messageNodeEdit || !messageNodeEdit.data) {
      console.log('Sem mensagem para editar');
      return;
    }
    onUpdate({
      ...messageNodeEdit,
      style: defaultNodeStyles,
      data: {
        ...messageNodeEdit.data,
        ...formData,
      },
    });

    setMessageNodeEdit(undefined);
  }, [formData, messageNodeEdit, onUpdate]);

  const handleCreateMessageNode = useCallback(() => {
    const uniqueId = uuidv4().replaceAll(/[^a-zA-Z0-9]/g, '');
    onAddNode({
      id: uniqueId,
      type: 'boxText',
      position: { x: 250, y: 0 },
      style: defaultNodeStyles,
      data: {
        type: INodeType.NODE,
        id: uniqueId,
        ...formData,
      },
    });
  }, [formData, onAddNode]);

  const handleClose = useCallback(() => {
    setMessageNodeEdit(undefined);
    setFormData(INITIAL_FORM_DATA);
    onClose();
  }, [onClose]);

  const handleDelete = useCallback(() => {
    if (!messageNodeEdit) return;
    onDelete(messageNodeEdit.id);
    handleClose();
  }, [handleClose, messageNodeEdit, onDelete]);

  const handleInputChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const formatValue = type === 'checkbox' ? checked : value;

    setFormData((state) => ({ ...state, [name]: formatValue }));
  }, []);

  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="teal"
        onClick={onOpen}
        position="absolute"
        zIndex="10"
        top="5"
        right="5"
      >
        {messageNodeEdit ? 'Editar' : 'Adicionar nova'} mensagem
      </Button>
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
            {messageNodeEdit ? 'Editar' : 'Adicionar nova'} mensagem
          </DrawerHeader>

          <DrawerBody>
            <form id="form-node" onSubmit={handleSaveMessageNode}>
              <Stack spacing="24px">
                <FormControl id="title" isRequired>
                  <FormLabel htmlFor="title">T??tulo</FormLabel>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Informe um t??tulo para a mensagem"
                    onChange={handleInputChange}
                    isRequired
                    value={formData.title}
                    errorBorderColor="red.400"
                  />
                </FormControl>
                <FormControl id="message" isRequired>
                  <FormLabel htmlFor="message">Mensagem de texto</FormLabel>
                  <Textarea
                    isRequired
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    errorBorderColor="red.400"
                  />
                </FormControl>

                <Checkbox
                  colorScheme="green"
                  size="lg"
                  isChecked={formData.isFinalFlow}
                  onChange={handleInputChange}
                  name="isFinalFlow"
                >
                  ?? fim de fluxo
                </Checkbox>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            {renderIf(
              <Button colorScheme="red" mr="auto" onClick={handleDelete}>
                Deletar
              </Button>,
              !!messageNodeEdit
            )}
            <Button variant="outline" mr={3} onClick={handleClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" type="submit" form="form-node">
              Salvar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
});

export default SideMessageControls;
