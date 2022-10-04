const { Schema, model } = require("mongoose");

const NoteSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    quantity: {type: Number, required: true},
    creator: { type: String, required: true },
    permissions: {type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = model("Note", NoteSchema);
