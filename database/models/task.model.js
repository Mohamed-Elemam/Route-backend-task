import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const listItemSchema = new Schema({
  body: { type: String, required: true },
});

const taskSchema = new Schema({
  title: { type: String, required: true },
  shared: { type: Boolean, default: false },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["text", "list"], required: true },
  body: { type: String },
  items: [listItemSchema],
});

taskSchema.plugin(mongoosePaginate);
export const taskModel = model("Task", taskSchema);
