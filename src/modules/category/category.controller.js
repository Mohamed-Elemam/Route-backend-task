import { categoryModel } from "../../../database/models/category.model.js";

const addCategory = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const { name } = req.body;
    const category = new categoryModel({ name, userId: _id });

    await category.save();
    res.status(201).json({ message: "Category added successfully", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding category", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const { id } = req.params;
    const { name } = req.body;
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (category.userId.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this category" });
    }

    category.name = name || category.name;

    await category.save();
    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted", category });
    if (category.userId.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this category" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};

const getUserCategories = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const { page = 1, limit = 10, sort = "name" } = req.query;
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { [sort]: 1 },
    };

    const categories = await categoryModel.paginate({ userId: _id }, options);

    if (!categories.docs.length) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.status(200).json({
      message: "Categories retrieved",
      categories: categories.docs,
      totalPages: categories.totalPages,
      currentPage: categories.page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving categories", error: error.message });
  }
};

export { addCategory, updateCategory, deleteCategory, getUserCategories };
