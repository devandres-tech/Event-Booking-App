const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql')

const app = express();

app.use(bodyParser.json());

// Graphql config
app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type RootQuery {

    }

    type RootMutation {

    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {}
}));

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
