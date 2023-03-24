import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_ANNOUNCEMENTS_QUERY } from '../util/graphql';

function AnnouncementForm() {
  const { values, onChange, onSubmit } = useForm(createAnnouncementCallback, {
    body: ''
  });

  const [createAnnouncement, { error }] = useMutation(CREATE_ANNOUNCEMENT_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_ANNOUNCEMENTS_QUERY
      });
      data.getAnnouncements = [result.data.createAnnouncement, ...data.getAnnouncements];
      proxy.writeQuery({ query: FETCH_ANNOUNCEMENTS_QUERY, data });
      values.body = '';
    }
  });

  function createAnnouncementCallback() {
    createAnnouncement();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create an announcement:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation createAnnouncement($body: String!) {
    createAnnouncement(body: $body) {
      id
      body
      createdAt
      username
      acks {
        id
        username
        createdAt
      }
      acknowledgeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default AnnouncementForm;