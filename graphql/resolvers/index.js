const announcementsResolvers = require('./announcements');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
  Announcement: {
    acknowledgeCount: (parent) => parent.acks.length,
    commentCount: (parent) => parent.comments.length
  },
  Query: {
    ...announcementsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...announcementsResolvers.Mutation,
    ...commentsResolvers.Mutation
  },
  Subscription: {
    ...announcementsResolvers.Subscription
  }
};