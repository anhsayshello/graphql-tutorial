import Person from "../../models/person.model.js";
import { GraphQLError } from "graphql";

const personResolver = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async () => {
      return Person.find({});
    },
    findPerson: async (root, args) => {
      return Person.findOne({ name: args.name });
    },
  },

  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args });
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      try {
        await person.save();
        currentUser.friends = currentUser.friends.concat(person);
        await currentUser.save();
      } catch (error) {
        throw new GraphQLError("Saving person failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            isValidNameError: args.name,
            error,
          },
        });
      }
      return person;
    },
    addAsFriend: async (root, args, { currentUser }) => {
      const isFriend = (person) =>
        currentUser.friends
          .map((f) => f._id.toString())
          .includes(person._id.toString());

      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const person = await Person.findOne({ name: args.name });
      if (!isFriend(person)) {
        currentUser.friends = currentUser.friends.concat(person);
      }
      await currentUser.save();
      return currentUser;
    },

    updatePerson: async (root, args) => {
      const person = await Person.findOne({ name: args.name });
      person.phone = args.phone;
      person.street = args.street;
      person.city = args.city;
      try {
        await person.save();
      } catch (error) {
        throw new GraphQLError("Update person failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            isValidNameError: args.name,
            error,
          },
        });
      }
      return person;
    },
  },
  Person: {
    address: (root) => ({
      street: root.street,
      city: root.city,
    }),
  },
};

export default personResolver;
