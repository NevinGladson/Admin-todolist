const mongoose = require('mongoose');
const { Schema } = mongoose;


const sessionSchema = new Schema({ // Schema for session, contains unique session ids and saves login time
  sessionId: { type: String, required: true, unique: true },
  loginTime: { type: Date, default: Date.now }
});

const userDetailSchema = new Schema({ // Schema for User Details
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountCreationDate: { type: Date, default: Date.now },
  sessions: [sessionSchema] // Array to store session objects
});

const UserDetail = mongoose.model('UserDetail', userDetailSchema);

module.exports = UserDetail;
