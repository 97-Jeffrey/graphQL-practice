const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");
const app = express();
const PORT = 5000;

const authors = [
  {id:1, name:"Jeffrey"},
  {id:2, name:"Aaron"},
  {id:3, name:"Stephan"}
]

const books=[
  {id:1, name:"Harry Potter", authorId:1},
  {id:2, name:"Good Day", authorId:1},
  {id:3, name:"We survived", authorId:1},
  {id:4, name:"Titantic", authorId:2},
  {id:5, name:"metabook", authorId:2},
  {id:6, name:"Switzerland", authorId:2},
  {id:7, name:"Jamie'cooking", authorId:3},
  {id:8, name:"water my flower", authorId:3 },
]



const BookType = new GraphQLObjectType({
  name:"Book",
  description:"This represents a book written by an author",
  fields:()=>({
    id:{ type: GraphQLNonNull(GraphQLInt) },
    name:{ type:GraphQLNonNull(GraphQLString) },
    authorId:{ type: GraphQLNonNull(GraphQLInt) },
    author:{ 
      type: AuthorType,
      resolve:(book)=>{
        return authors.find(author=>author.id == book.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name:"Author",
  description:"this is a single author of a book",
  fields:()=>({
    id: { type: GraphQLNonNull(GraphQLInt)},
    name:{ type: GraphQLNonNull(GraphQLString)}
  })
})

const RootQueryType = new GraphQLObjectType({
  name:"query",
  description:"Root Query",
  fields:()=>({
     books:{
       type: new GraphQLList(BookType),
       description:"List of all books",
       resolve:()=>books
      }
  })
})

const schema = new GraphQLSchema({
  query:RootQueryType,

})



app.use('/graphql', expressGraphQL({
  schema:schema,
  graphiql:true
}))


app.listen(PORT, ()=>{
  console.log(`the server is listening on port ${PORT} `)
})