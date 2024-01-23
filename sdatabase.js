import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    _id: {
      type: String,
    },
    data: {
      type: Object,
    },
  });
  
  // Create a model using the schema
  const Document = mongoose.model('Document', DocumentSchema);
  export default Document;