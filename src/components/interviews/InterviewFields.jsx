/* eslint-disable react/no-array-index-key */
import React, { useCallback, useMemo } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';

import Loading from 'components/common/Loading';
import Button from 'components/common/Button';

import InterviewField from 'components/interviews/InterviewField';

import useModal from 'hooks/useModal';
import useConfirm from 'hooks/useConfirm';
import useLazyQuery from 'hooks/useLazyQuery';

import prepareInterviewSections from 'utils/interview/prepareInterviewSections';

import INTERVIEW_CONFLICTS from 'graphql/queries/interview/interviewConflicts';
import MERGE_CONFLICTS from 'graphql/mutations/interview/mergeConflicts';
import INTERVIEW from 'graphql/queries/interview/interview';
import CLIENT from 'graphql/queries/client/client';

const InterviewFields = ({ token, client, isOpen }) => {
  const { open } = useModal('DELETE_INTERVIEW');

  const handleOpenModal = useCallback(() => open({ token, client }), [open, token, client]);

  const confirm = useConfirm({
    size: 'sm',
    title: 'Merge all fields?',
    message: "All completed fields from the interview will be overwritten in the client's profile",
    negativeBtnLabel: 'No',
    positiveBtnLabel: 'Yes',
  });

  const [mergeConflicts] = useMutation(MERGE_CONFLICTS);

  const {
    data: interviewData,
    loading: interviewLoading,
    refetch: refetchInterview,
  } = useQuery(INTERVIEW, {
    variables: { where: { token } },
    skip: !isOpen || !token,
  });

  const { data, loading, refetch } = useQuery(INTERVIEW_CONFLICTS, {
    variables: { where: { token } },
    skip: !isOpen || !token,
  });

  const refetchClient = useLazyQuery(CLIENT);

  const interview = useMemo(() => interviewData?.interview || {}, [interviewData?.interview]);

  const conflicts = useMemo(
    () => JSON.parse(data?.intakeInterviewMergeDifference?.content || '{}'),
    [data?.intakeInterviewMergeDifference?.content],
  );

  const handleMergeAll = useCallback(async () => {
    if (!(await confirm())) return;

    try {
      const toastId = toast.loading('Merging interview fields with client profile...');

      await mergeConflicts({ variables: { where: { token }, mode: 'FORCE' } });

      await refetchClient({ where: { id: client?.id } }, 'network-only');
      await refetchInterview();
      await refetch();

      toast.dismiss(toastId);
      toast.success('Interview fields merged successfully');
    } catch {
      toast.dismiss();
      toast.error('Something went wrong. Try again later');
    }
  }, [confirm, token, mergeConflicts, refetch, client?.id, refetchClient, refetchInterview]);

  const interviewSections = useMemo(() => {
    if (interviewLoading || loading) return null;

    return prepareInterviewSections(client, conflicts, interview?.intakeInterview || {});
  }, [client, conflicts, interview, interviewLoading, loading]);

  if (loading || interviewLoading) return <Loading />;

  // console.log(client, interviewSections, conflicts, interview);

  return (
    <div className='interview-container'>
      {interview?.status === 'COMPLETE' && (
        <div className='interview-section-container' key='progress'>
          <div className='interview-section'>
            <div className='section-name'>Progress</div>
            <div className='section-fields-list'>
              <div className='field'>
                <span className='field-name'>Completed fields:</span>
                <span className='field-value'>
                  {interview?.completedFields} / {interview?.totalFields}
                </span>
              </div>
              <div className='field'>
                <span className='field-name'>Answers merged to profile:</span>
                <span className='field-value'>
                  {interview?.mergedFields} / {interview?.completedFields}
                </span>
              </div>
              <div className='field'>
                <span className='field-name'>Conflicts:</span>
                <span className='field-value'>{interview?.conflictFields}</span>
                <span className='field-value-description'>
                  (Click red fields to merge conflicts.)
                </span>
              </div>
              {interview?.conflictFields > 0 && (
                <div className='field' onClick={handleMergeAll}>
                  <Button>Merge all</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {interviewSections.map((section, i) => {
        if (section[0]?.isEmpty) return null;

        return (
          <div className='interview-section-container' key={i}>
            {section.map(({ name, fields, isEmpty }) => {
              if (isEmpty) return null;

              return (
                <div className='interview-section' key={name}>
                  <div className='section-name'>{name}</div>
                  <div className='section-fields-list'>
                    {fields?.map(field => (
                      <InterviewField
                        {...field}
                        sectionName={name}
                        token={interview?.token}
                        refetchConflicts={refetch}
                        key={field.name + i}
                        clientId={client?.id}
                        interviewId={interview?.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div className='interview-section-container' key='delete'>
        <div className='interview-section'>
          <div className='section-name' />
          <div className='section-fields-list'>
            <div className='field'>
              <Button
                color='red-link'
                className='delete'
                leftIcon='trash'
                size='sm'
                onClick={handleOpenModal}
              >
                Delete interview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFields;
