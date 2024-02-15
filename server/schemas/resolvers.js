const { User, Book } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async(parent, args) => {
            return User.find();
        },
        user: async( parent, { userId }) => {
            return User.findOne({ _id: userId });
        },
        me: async (parent, args, context) => {
            try {
              if (context.user) {
                const currentUser = await User.findOne({ _id: context.user._id });
                return currentUser
              } else {
                return AuthenticationError;
              }
            } catch (error) {
                console.log(error);
            }

            
        }
    },

    Mutation: {
        userLogin: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw AuthenticationError;
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw AuthenticationError;
            }
      
            const token = signToken(user);
            return { token, user };
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
            try {
                if (context.user) {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id }, 
                        { $pull: {savedBooks: { bookId: bookId }}},
                        { new: true }
                    );
                    return updatedUser;
                }
            } catch (err) {
                console.log(err)
            }
          },
    }
};

module.exports = resolvers;