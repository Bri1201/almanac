import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_ANNOUNCEMENTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function DeleteButton({ announcementId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_ANNOUNCEMENT_MUTATION;

  const [deleteAnnouncementOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_ANNOUNCEMENTS_QUERY
        });
        data.getAnnouncements = data.getAnnouncements.filter((p) => p.id !== announcementId);
        proxy.writeQuery({ query: FETCH_ANNOUNCEMENTS_QUERY, data });
      }
      if (callback) callback();
    },
    variables: {
      announcementId,
      commentId
    }
  });
  return (
    <>
      <MyPopup content={commentId ? 'Delete comment' : 'Delete announcement'}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteAnnouncementOrMutation}
      />
    </>
  );
}

const DELETE_ANNOUNCEMENT_MUTATION = gql`
  mutation deleteAnnouncement($announcementId: ID!) {
    deleteAnnouncement(announcementId: $announcementId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($announcementId: ID!, $commentId: ID!) {
    deleteComment(announcementId: $announcementId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;