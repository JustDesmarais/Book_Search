const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        profile: async( parent, { userId }) => {
            return User.findOne({ _id: userId });
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id })
            }

            return AuthenticationError;
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const profile = await User.findOne({ email });
      
            if (!profile) {
              throw AuthenticationError;
            }
      
            const correctPw = await profile.isCorrectPassword(password);
      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(profile);
            return { token, profile };
          },
          addUser: async (parent, {username, email, password}) =>{
            const user = User.create({username, email, password});
            const token = signToken(user);
            
            return { token, user }
          },
          saveBook: async(parent, {bookId, authors, description, title, image, link}, context ) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {
                        savedBooks: {
                            bookId: bookId,
                            authors: authors,
                            description: description,
                            title: title,
                            image: image,
                            link: link
                        },
                    }},
                    {
                        new: true,
                        runValidators: true
                    })
            }
          },
          removeBook: async(parent, { bookId }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    { _id: context.user._id }, 
                    { $pull: {savedBooks: { bookId: bookId }}},
                    { new: true }
                )
            }
          },

    }
}