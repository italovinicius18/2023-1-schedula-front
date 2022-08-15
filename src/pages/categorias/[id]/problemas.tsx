import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { AxiosResponse } from 'axios';

import { CategoriaForm as ProblemTypeForm } from '@components/Forms/CategoriaForm';
import { ListItem } from '@components/ListItem';
import { ListItemSkeleton } from '@components/ListItem/LIstItemSkeleton';
import { Modal } from '@components/Modal/Modal';
import { PageHeader } from '@components/PageHeader';
import { ApiData, useRequest } from '@hooks/useRequest';
import { detalhadorApi } from '@services/DetalhadorChamados';
import {
  createProblemType,
  deleteProblemType,
  getProblemTypes,
  updateProblemType,
} from '@services/Problemas';
import { request } from '@services/request';

const ListaProblemas = () => {
  const router = useRouter();

  const category_id = Number(router.query?.id);

  const {
    data: problemas,
    isLoading,
    mutate,
  } = useRequest<ProblemType[]>(getProblemTypes(category_id)(), detalhadorApi);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [problemToEdit, setProblemToEdit] = useState<ProblemType>();

  const handleDelete = useCallback(
    (id: number) => async () => {
      const response = await request(deleteProblemType(id), detalhadorApi);

      if (response.type === 'success') {
        toast.success('Tipo de problema deletado com sucesso!');

        const newProblemas = problemas?.data.filter(
          (problema) => problema.id !== id
        );

        mutate(
          {
            data: {
              error: null,
              message: '',
              data: newProblemas || ([] as ProblemType[]),
            },
          } as AxiosResponse<ApiData<ProblemType[]>>,
          { revalidate: false }
        );

        return;
      }

      toast.error('Erro ao deletar Tipo de Problema!');
    },
    [problemas?.data, mutate]
  );

  const handleEdit = useCallback(
    (categoria: ProblemType) => () => {
      setProblemToEdit(categoria);
      onOpen();
    },
    [onOpen]
  );

  const onSubmit = useCallback(
    async (data: ProblemTypePayload) => {
      console.log('DATA: ', data);

      const response = await request<{ data: ProblemType }>(
        problemToEdit
          ? updateProblemType(problemToEdit.id)(data)
          : createProblemType({ ...data, category_id }),
        detalhadorApi
      );

      if (response.type === 'success') {
        toast.success('Tipo de Problema criado com sucesso!');

        const newProblemas = problemas?.data.filter(
          (problema) => problema.id !== problemToEdit?.id
        );

        mutate({
          data: {
            error: null,
            message: '',
            data: [...(newProblemas || []), response.value.data],
          },
        } as AxiosResponse<ApiData<ProblemType[]>>);

        setProblemToEdit(undefined);
        onClose();

        return;
      }

      toast.error('Erro ao criar Tipo de Problema!');
    },
    [problemToEdit, category_id, problemas?.data, mutate, onClose]
  );

  const handleClose = useCallback(() => {
    setProblemToEdit(undefined);
    onClose();
  }, [onClose]);

  return (
    <>
      <PageHeader title='Gerenciar Tipos de Problema'>
        <Button onClick={onOpen}>Novo Tipo de Problema</Button>
      </PageHeader>

      {isLoading ? (
        <ListItemSkeleton />
      ) : (
        <Flex flexDirection='column' gap={8}>
          {problemas?.data?.map?.((item, key) => (
            <ListItem
              title={item?.name}
              description={item?.description}
              key={key}
            >
              <ListItem.Actions
                itemName={item?.name}
                onEdit={handleEdit(item)}
                onDelete={handleDelete(item.id)}
              />
            </ListItem>
          ))}
        </Flex>
      )}

      <Modal
        title={
          problemToEdit ? 'Editar Tipo de Problema' : 'Novo Tipo de Problema'
        }
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ProblemTypeForm
          // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop -- ignore
          defaultValues={{ ...problemToEdit, category_id } as ProblemType}
          onSubmit={onSubmit}
        />
      </Modal>
    </>
  );
};

export default ListaProblemas;
