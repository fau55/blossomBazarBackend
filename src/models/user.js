import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePhoto: {
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/blossam-bazar.appspot.com/o/images%2Fconsultant%2Fuser.png?alt=media&token=66835751-2c63-49c1-a5fc-baacfea51bf0'
  },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

export { User };
