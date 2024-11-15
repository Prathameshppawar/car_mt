import mongoose from 'mongoose';

const CarSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title for the car'],
    maxlength: 100,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  tags: {
    type: [String],
  },
  images: {
    type: [String],  // URLs of uploaded images
    validate: [arrayLimit, '{PATH} exceeds the limit of 10'],
  },
}, {
  timestamps: true,
});

function arrayLimit(val) {
  return val.length <= 10;
}

export default mongoose.models.Car || mongoose.model('Car', CarSchema);
