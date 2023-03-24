const { AuthenticationError, UserInputError } = require('apollo-server');

const Announcement = require('../../models/Announcement');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getAnnouncements() {
      try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        return announcements;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getAnnouncement(_, { announcementId }) {
      try {
        const announcement = await Announcement.findById(announcementId);
        if (announcement) {
          return announcement;
        } else {
          throw new Error('Announcement not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createAnnouncement(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Announcement body must not be empty');
      }

      const newAnnouncement = new Announcement({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const announcement = await newAnnouncement.save();

      context.pubsub.publish('NEW_ANNOUNCEMENT', {
        newAnnouncement: announcement
      });

      return announcement;
    },
    async deleteAnnouncement(_, { announcementId }, context) {
      const user = checkAuth(context);

      try {
        const announcement = await Announcement.findById(announcementId);
        if (user.username === announcement.username) {
          await announcement.delete();
          return 'Announcement deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async acknowledgeAnnouncement(_, { announcementId }, context) {
      const { username } = checkAuth(context);

      const announcement = await Announcement.findById(announcementId);
      if (announcement) {
        if (announcement.acks.find((acknowledge) => acknowledge.username === username)) {
          // Announcement already acknolwedged, unacknowledge it
          announcement.acks = announcement.acks.filter((acknowledge) => acknowledge.username !== username);
        } else {
          // Not acknowledged, acknowledge Announcement
          announcement.acks.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await announcement.save();
        return announcement;
      } else throw new UserInputError('Announcement not found');
    }
  },
  Subscription: {
    newAnnouncement: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_ANNOUNCEMENT')
    }
  }
};