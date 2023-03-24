import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import AnnouncementCard from '../components/AnnouncementCard';
import AnnouncementForm from '../components/AnnouncementForm';
import { FETCH_ANNOUNCEMENTS_QUERY } from '../util/graphql';

function Home() {
  const { user } = useContext(AuthContext);
  const {
    loading,
    data: { getAnnouncements: announcements }
  } = useQuery(FETCH_ANNOUNCEMENTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Announcements</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <AnnouncementForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading announcements..</h1>
        ) : (
          <Transition.Group>
            {announcements &&
              announcements.map((announcement) => (
                <Grid.Column key={announcement.id} style={{ marginBottom: 20 }}>
                  <AnnouncementCard announcement={announcement} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;