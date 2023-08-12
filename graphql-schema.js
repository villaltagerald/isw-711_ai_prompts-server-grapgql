const { buildSchema } = require('graphql');
exports.graphQLschema = buildSchema(`
type Query {
  getPrompt: [Prompt]
  searchPrompt(name: String, type: PromptType, tags: [String]): [Prompt]
  hello: String
  version: String
}

type Prompt {
  _id:String
  name: String
  type: PromptType
  tags: [String]
  userId: User
  questions: [Question]
}

type Question {
  responseCount: Int
  input: String
  instruction: String
  temperature: Float
  imagesize: String
  response: [String]
  timestamp: String
}

enum PromptType {
  Edit
  Images
  Completitions
}

type User {
  _id:String
  first_name: String
  last_name: String
  email: String
  phone: Int
  verified: Boolean
  two_fa: Boolean
  permission: [Permission]
}

type Permission {
  permission: [String]
  idPermission: String
}

`);