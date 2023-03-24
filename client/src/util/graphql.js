import gql from 'graphql-tag';

export const FETCH_ANNOUNCEMENTS_QUERY = gql`
  {
    getAnnouncements {
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