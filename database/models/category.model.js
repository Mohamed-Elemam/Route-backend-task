import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const categorySchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
categorySchema.plugin(mongoosePaginate);

export const categoryModel = model("Category", categorySchema);
