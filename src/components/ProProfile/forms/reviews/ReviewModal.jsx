import React from 'react';

import { toast } from 'react-toastify';

import Modal from 'components/common/Modal';

import ReviewForm from 'components/ProProfile/forms/reviews/ReviewForm';

import useModal from 'hooks/useModal';
import useDeleteReviewMutation from 'graphql/hooks/reviews/useDeleteReview';

export const REVIEW_MODAL = 'REVIEW_MODAL';

const CreateReviewModal = () => {
  const { options: { initialValues, refetch } = {} } = useModal(REVIEW_MODAL);
  const { deleteReview } = useDeleteReviewMutation(refetch);

  const deleteHandler = () => {
    deleteReview(initialValues.id)
      .then(() => toast.success('Review has been successfully deleted'))
      .catch(err => err.graphQLErrors?.map(({ message }) => toast.error(message)));
  };

  return (
    <Modal
      autoFocus={false}
      name={REVIEW_MODAL}
      form={REVIEW_MODAL}
      title={initialValues ? 'Edit Review' : 'Add Review'}
      submitButtonTitle='Confirm'
      className='review-modal'
      bodyClassName='review-body'
      closeButtonTitle='Cancel'
      deleteClassName='delete-review ml-auto pr-0'
      deleteButtonTitle='Delete Review'
      showCloseButton
      onDeleteClick={initialValues && deleteHandler}
    >
      <ReviewForm initialValues={initialValues} formId={REVIEW_MODAL} />
    </Modal>
  );
};

export default CreateReviewModal;
