import { useForm } from 'react-hook-form';
import { BiEditAlt } from 'react-icons/bi';
import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';

type FormProps = {
  id: number;
  name: string;
  description: string;
  active: boolean;
  category_id: string | string[];
};

interface ModalEditTiposProps {
  id: number;
  name: string;
  description: string;
  category_id: string | string[];
  callBackEdit: (novotipo: FormProps) => void;
}

export const ModalEditTipos = ({
  id,
  name,
  description,
  category_id,
  callBackEdit,
}: ModalEditTiposProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    handleSubmit,
    register,
    reset,
    formState: {},
  } = useForm<FormProps>({
    defaultValues: {
      name,
      description,
    },
  });

  //   const onEdit: SubmitHandler<FormProps> = async (data) => {
  //     data.id = id;
  //     data.active = true;
  //     data.category_id = category_id;
  //     listproblemas
  //       .put('/problema/' + data.id, data)
  //       .then(() => {
  //         toast.success('O problema ' + data.name + ' foi atualizado', {
  //           position: 'top-left',
  //           autoClose: 2000,
  //         });
  //         callBackEdit(data);
  //       })
  //       .catch(() => {
  //         toast.warning('Falha ao atualizar problema!', {
  //           position: 'top-left',
  //           autoClose: 2000,
  //         });
  //       });
  //     reset();
  //     onClose();
  //   };

  return (
    <>
      <Box
        m='0 auto'
        mt='1em'
        maxH={'20px'}
        fontSize={'xl'}
        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop -- Its hover.
        _hover={{ boxShadow: 'dark-lg' }}
        onClick={onOpen}
      >
        <BiEditAlt />
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={'center'} fontSize={'3xl'}>
            Editar Problema
          </ModalHeader>

          <ModalBody>
            {/* <form onSubmit={handleSubmit(onEdit)}>
              <Box w={'50%'} m={'0 auto'}>
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    borderRadius={'8px'}
                    size={'sm'}
                    placeholder='Nome'
                    {...register('name')}
                  />
                </FormControl>

                <FormControl mt={'24px'}>
                  <FormLabel>Descrição</FormLabel>
                  <Input
                    borderRadius={'8px'}
                    size={'sm'}
                    placeholder='Descrição'
                    {...register('description')}
                  />
                </FormControl>
              </Box>

              <ModalFooter justifyContent={'center'} mt={'60px'}>
                <Button
                  variant={'solid'}
                  bg='InfoBackground'
                  color='black'
                  mr={'30px'}
                  onClick={onClose}
                  border={'1px'}
                  borderColor={'black'}
                  borderRadius={'50px'}
                  fontSize={'medium'}
                >
                  Cancelar
                </Button>
                <Button
                  colorScheme={'orange'}
                  bg='primary'
                  color={'white'}
                  type='submit'
                  borderRadius={'50px'}
                  boxShadow={'dark-lg'}
                >
                  <Text fontSize={'smaller'}>ATUALIZAR PROBLEMA</Text>
                </Button>
              </ModalFooter>
            </form> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
