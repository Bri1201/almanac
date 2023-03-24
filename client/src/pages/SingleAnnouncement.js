import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import {
  Button,
  Card,
  Form,
  Grid,
  Image,
  Icon,
  Label
} from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import AcknowledgeButton from '../components/AcknowledgeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';

function SingleAnnouncement(props) {
  const announcementId = props.match.params.announcementId;
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const [comment, setComment] = useState('');

  const {
    data: { getAnnouncement }
  } = useQuery(FETCH_ANNOUNCEMENT_QUERY, {
    variables: {
      announcementId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      announcementId,
      body: comment
    }
  });

  function deleteAnnouncementCallback() {
    props.history.push('/');
  }

  let announcementMarkup;
  if (!getAnnouncement) {
    announcementMarkup = <p>Loading announcement..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      acks,
      acknowledgeCount,
      commentCount
    } = getAnnouncement;

    announcementMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <AcknowledgeButton user={user} announcement={{ id, acknowledgeCount, acks }} />
                <MyPopup content="Comment on announcement">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log('Comment on announcement')}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton announcementId={id} callback={deleteAnnouncementCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton announcementId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return announcementMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($announcementId: String!, $body: String!) {
    createComment(announcementId: $announcementId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_ANNOUNCEMENT_QUERY = gql`
  query($announcementId: ID!) {
    getAnnouncement(announcementId: $announcementId) {
      id
      body
      createdAt
      username
      acknowledgeCount
      acks {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SingleAnnouncement;