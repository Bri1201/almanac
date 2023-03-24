const { gql } = require('apollo-server');

module.exports = gql`
  type Announcement {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    acks: [Acknowledge]!
    acknowledgeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Acknowledge {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getAnnouncements: [Announcement]
    getAnnouncement(announcementId: ID!): Announcement
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createAnnouncement(body: String!): Announcement!
    deleteAnnouncement(announcementId: ID!): String!
    createComment(announcementId: String!, body: String!): Announcement!
    deleteComment(announcementId: ID!, commentId: ID!): Announcement!
    acknowledgeAnnouncement(announcementId: ID!): Announcement!
  }
  type Subscription {
    newAnnouncement: Announcement!
  }
`;