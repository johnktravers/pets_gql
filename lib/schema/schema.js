const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql;

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    pets: {
      type: new GraphQLList(PetType),
      resolve(parent, args) {
        return database.from('owners').innerJoin('pets', 'pets.owner_id', 'owners.id').where('pets.owner_id', parent.id);
      }
    }
  })
});

const PetType = new GraphQLObjectType({
  name: 'Pet',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    animal_type: {type: GraphQLString},
    breed: {type: GraphQLString},
    age: {type: GraphQLInt},
    favorite_treat: {type: GraphQLString},
    owner: {
      type: OwnerType,
      resolve(parent, args) {
        return database.from('pets')
          .innerJoin('owners', 'pets.owner_id', 'owners.id')
          .where('owners.id', parent.owner_id)
          .first()
      }
    }
  })
});
