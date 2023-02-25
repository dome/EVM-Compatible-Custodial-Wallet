const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String },

    networks: [
      {
        name: { type: String },
        accounts: [
          {
            privateKey: { type: String },
            publicKey: { type: String },
          },
        ],
        // tokens: [
        //   {
        //     tokenName: { type: String },
        //     address: { type: String },
        //   },
        // ],
      },
    ],
  },
  { timestamps: true }
);

// UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
