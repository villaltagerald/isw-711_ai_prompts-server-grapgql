const Prompts = require("../models/promptsModel");

/**
 * Get all courses or one
 *
 * @param {*} req
 * @param {*} res
 */
const promptsGetAll = (req, res) => {
  // if an specific prompt is required
  const filter = { userId: req.user }
  return Prompts.find(filter,(error, courses) => {
    if (error) {
      console.log('there was an error', error);
      return error;
    }
    return courses;
  }).exec();
};

/**
 * Get Search prompt
 *
 * @param {*} req
 * @param {*} res
 */
const promptSearch = (args, req, res) => {
  console.log(args)
  const filter = { userId: req.user }
  if (args.name) {
    filter.name = { $regex: `${args.name}`, $options: 'i' };
  }
  if (args.type) {
    filter.type = { $regex: `${args.type}`, $options: 'i' };
  }
  if (args.tags) {
    filter.tags = { $regex: `${args.tags}`, $options: 'i' };
  }

  return Prompts.find(filter, (error, courses) => {
    if (error) {
      console.log('there was an error', error);
      return error;
    }
    return courses;
  }).exec();
};

module.exports = {
  promptsGetAll,
  promptSearch
}