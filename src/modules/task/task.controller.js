import { taskModel } from "../../../database/models/task.model.js";
import { categoryModel } from "../../../database/models/category.model.js";

const addTask = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const { title, type, shared, categoryId, body, items } = req.body;

    const category = await categoryModel.findById(categoryId);
    if (!category || category.userId.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ message: "Invalid category or permission denied" });
    }

    const task = new taskModel({
      title,
      type,
      shared,
      categoryId,
      userId: _id,
      body: type === "text" ? body : undefined,
      items: type === "list" ? items : undefined,
    });

    await task.save();
    res.status(201).json({ message: "Task added successfully", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const { taskId } = req.params;
    const { title, type, shared, categoryId, body, items } = req.body;

    const task = await taskModel.findById(taskId);
    if (!task || task.userId.toString() !== _id.toString()) {
      return res.status(403).json({
        message: "You are not the task creator or task doesn't exist",
      });
    }

    if (categoryId) {
      const category = await categoryModel.findById(categoryId);
      if (!category || category.userId.toString() !== _id.toString()) {
        return res
          .status(403)
          .json({ message: "Invalid category or permission denied" });
      }
    }

    task.title = title || task.title;
    task.type = type || task.type;
    task.shared = shared !== undefined ? shared : task.shared;
    task.categoryId = categoryId || task.categoryId;

    if (task.type === "text") {
      task.body = body || task.body;
      task.items = undefined;
    } else if (task.type === "list") {
      task.items = items || task.items;
      task.body = undefined;
    }

    await task.save();
    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const { taskId } = req.params;

    const task = await taskModel.findByIdAndDelete(taskId);
    if (!task || task.userId.toString() !== _id.toString()) {
      return res.status(403).json({
        message: "You are not the task creator or task doesn't exist",
      });
    }

    res.status(200).json({ message: "Task deleted", task });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const { _id } = req.authUser;
    const {
      categoryId,
      shared,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
    } = req.query;

    let filter = { userId: _id };
    if (categoryId) filter.categoryId = categoryId;
    if (shared !== undefined) filter.shared = shared === "true";

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: {},
    };

    if (sortBy) {
      options.sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    const tasks = await taskModel.paginate(filter, options);

    if (!tasks.docs.length) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json({
      message: "Tasks retrieved",
      tasks: tasks.docs,
      totalPages: tasks.totalPages,
      currentPage: tasks.page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving tasks", error: error.message });
  }
};

const getPublicTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { title: 1 },
    };

    const tasks = await taskModel.paginate({ shared: true }, options);

    if (!tasks.docs.length) {
      return res.status(404).json({ message: "No public tasks found" });
    }

    res.status(200).json({
      message: "Public tasks retrieved",
      tasks: tasks.docs,
      totalPages: tasks.totalPages,
      currentPage: tasks.page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving public tasks", error: error.message });
  }
};

export { addTask, deleteTask, updateTask, getUserTasks, getPublicTasks };
