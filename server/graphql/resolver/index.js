import personResolver from "./personResolver.js";
import userResolver from "./userResolver.js";
import pkg from "lodash";
const { merge } = pkg;

const resolvers = merge(personResolver, userResolver);
export default resolvers;
