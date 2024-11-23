import ExampleModel from '../models/exampleModel.js';
import { NotFoundError, ValidationError } from '../utils/customErrors.js';

export const getAllExamples = async () => {
  try {
    return await ExampleModel.find({});
  } catch (error) {
    throw new ValidationError('Error fetching examples', error);
  }
};

export const createExample = async (data) => {
  const newExample = new ExampleModel(data);
  try {
    await newExample.validate();
  } catch (errors) {
    throw new ValidationError('Mongoose validation exception while creating example', errors);
  }
  return await newExample.save();
};

export const getExampleById = async (id) => {
  const example = await ExampleModel.findById(id);
  if (!example) {
    throw new NotFoundError('Example not found');
  }
  return example;
};

export const updateExample = async (id, data) => {
  const updatedExample = await ExampleModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updatedExample) {
    throw new NotFoundError('Example not found while updating');
  }
  return updatedExample;
};

export const deleteExample = async (id) => {
  const deletedExample = await ExampleModel.findByIdAndDelete(id);
  if (!deletedExample) {
    throw new NotFoundError('Example not found while deleting');
  }
  return deletedExample;
};

export default {
  getAllExamples,
  createExample,
  getExampleById,
  updateExample,
  deleteExample,
};
