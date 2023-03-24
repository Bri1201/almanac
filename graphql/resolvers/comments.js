const { AuthenticationError, UserInputError } = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const Announcement = require('../../models/Announcement');

module.exports = {
  Mutation: {
    createComment: async (_, { announcementId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not empty'
          }
        });
      }

      const announcement = await Announcement.findById(announcementId);

      if (announcement) {
        announcement.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        await announcement.save();
        return announcement;
      } else throw new UserInputError('Announcement not found');
    },
    async deleteComment(_, { announcementId, commentId }, context) {
      const { username } = checkAuth(context);

      const announcement = await Announcement.findById(announcementId);

      if (announcement) {
        const commentIndex = announcement.comments.findIndex((c) => c.id === commentId);

        if (announcement.comments[commentIndex].username === username) {
          announcement.comments.splice(commentIndex, 1);
          await announcement.save();
          return announcement;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Announcement not found');
      }
    }
  }
};