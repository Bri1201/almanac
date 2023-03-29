import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import AcknowledgeButton from './AcknowledgeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';

function isprof(email) {
  var regex = /^[^@\s]+@vit\.ac\.in$/;
  return regex.test(email);
}


function AnnouncementCard({
  announcement: { body, createdAt, id, username, acknowledgeCount, commentCount, acks }
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/announcements/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <AcknowledgeButton user={user} announcement={{ id, acks, acknowledgeCount }} />
        <MyPopup content="Comment on announcement">
          <Button labelPosition="right" as={Link} to={`/announcements/${id}`}>
            <Button color="blue" basic>
              <Icon name="comments" />
            </Button>
            <Label basic color="blue" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && (user.username === username || user.username === 'brinda' || user.username === 'dhananjay' || isprof(user.email)) && <DeleteButton announcementId={id} />}
      </Card.Content>
    </Card>
  );
}

export default AnnouncementCard;