import mongoose, { Document, Model } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  date: Date;
  isVerified: boolean;
  userid: string;
  role: string;
  username?: string;
  integrations?: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  userid: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
  integrations: {
    type: String,
    required: false,
  },
});

const User: Model<IUser> = mongoose.model('User', userSchema);

export  {User, IUser};
