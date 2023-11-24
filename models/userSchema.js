const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  Fname: {
    type: String,
    required: true,
    trim: true,
  },
  Lname: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email");
      }
    },
  },
  Mobile: {
    type: String,
    required: true,
    // unique:true,
  },
  messages: [],
});

// save message
userSchema.methods.Messagesave = async function (Message) {
  try {
    this.Messages = this.Messages.concat({ Message });
    await this.save();
    return Message;
  } catch (error) {
    console.log(error);
  }
};

// create model
const users = new mongoose.model("users", userSchema);

module.exports = users;
