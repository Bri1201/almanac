import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';

import MyPopup from '../util/MyPopup';

function AcknowledgeButton({ user, announcement: { id, acknowledgeCount, acks } }) {
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (user && acks.find((acknowledge) => acknowledge.username === user.username)) {
      setAcknowledged(true);
    } else setAcknowledged(false);
  }, [user, acks]);

  const [acknowledgeAnnouncement] = useMutation(ACKNOWLEDGE_ANNOUNCEMENT_MUTATION, {
    variables: { announcementId: id }
  });

  const acknowledgeButton = user ? (
    acknowledged ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Button as="div" labelPosition="right" onClick={acknowledgeAnnouncement}>
      <MyPopup content={acknowledged ? 'Unacknowledge' : 'Acknowledge'}>{acknowledgeButton}</MyPopup>
      <Label basic color="teal" pointing="left">
        {acknowledgeCount}
      </Label>
    </Button>
  );
}

const ACKNOWLEDGE_ANNOUNCEMENT_MUTATION = gql`
  mutation acknowledgeAnnouncement($announcementId: ID!) {
    likeAnnouncement(announcementId: $announcementId) {
      id
      acks {
        id
        username
      }
      acknowledgeCount
    }
  }
`;

export default AcknowledgeButton;