import { HStack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { RefreshButton } from '@/components/action-buttons/refresh-button';
import { PageHeader } from '@/components/page-header';
import { useGetAllIssues } from '@/features/homologations/api/get-all-extern-issues';
import { ExternIssue, IssueOpen } from '@/features/issues/types';
import { Permission } from '@/components/permission';
import { ListView } from '@/components/list';
import { ExternIssueItem } from '@/features/homologations/components/extern-issue-item';
import { useDeleteHomologation } from '@/features/homologations/api/delete-extern-issue';
import { useGetAllSchedulesOpen } from '@/features/schedules/api/get-all-schedules';
import { addItemToList, globalList } from './globalList';
import { ItemProps } from '@/components/list-item';

export function GerenciarHomologacao() {
  const {
    data: externIssues,
    isLoading: isLoadingExternIssues,
    refetch,
  } = useGetAllIssues();

  const { data: schedules, isLoading: isLoadingSchedules } =
    useGetAllSchedulesOpen();

  const scheduledIssues = schedules
    ? schedules.map((schedule) => schedule.issue.id)
    : [];

  const { mutate: deleteIssues, isLoading: isDeletingIssue } =
    useDeleteHomologation();

  const onDelete = useCallback(
    (id: string) => {
      deleteIssues({ id });
    },
    [deleteIssues]
  );

  useEffect(() => {
    const storedList = localStorage.getItem('globalList');

    if (storedList) {
      const parsedList = JSON.parse(storedList);
      globalList.length = 0;
      globalList.push(...parsedList);
    }
  }, []);

  const renderExternIssueItem = useCallback(
    (externIssue: IssueOpen) => {
      // Verificar se o ID do Issue está na lista de schedules
      const isIssueScheduled = schedules?.some(
        (schedule) => schedule.issue.id === externIssue.id
      );

      console.log(globalList);

      // Se o ID estiver na lista de schedules, não renderizar o card
      if (isIssueScheduled) {
        addItemToList(externIssue.id);
      }

      if (globalList.includes(externIssue.id)) {
        return null as unknown as JSX.Element;
      }

      return (
        <ExternIssueItem
          externIssue={externIssue}
          onDelete={onDelete}
          isDeleting={isDeletingIssue}
        />
      );
    },
    [schedules, onDelete, isDeletingIssue]
  );

  return (
    <>
      <Permission allowedRoles={['ADMIN']}>
        <PageHeader title="Homologação">
          <HStack spacing={2}>
            <RefreshButton refresh={refetch} />
          </HStack>
        </PageHeader>
      </Permission>

      <ListView<IssueOpen>
        items={externIssues}
        render={renderExternIssueItem}
        isLoading={isLoadingExternIssues}
      />
    </>
  );
}
