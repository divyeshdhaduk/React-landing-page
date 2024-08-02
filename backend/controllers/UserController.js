const bcrypt = require("bcryptjs");
const { prepareSuccessResponse } = require("../utils/responseHandler");
const User = require("../models/User");
const fs = require("fs")

exports.createUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      confirm_password,
      role_id,
      store_id,
    } = req.body;

    // Check if password and confirm password match
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Password and confirm password do not match" });
    }

    // Check if a user already exists with the same email
    const existingUser = await User.findOne({ email, store_id });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Check if package limits allow adding a new user
    const packageContent = await PlanContent.findOne({ store_id: store_id, isPlanActive: true });
    if (!packageContent || packageContent.remaining_user === 0) {
      return res.status(500).json({ message: "Your package has no remaining user limit" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new User({
      first_name,
      last_name,
      email,
      phone,
      password: hashedPassword, // Save the hashed password to the user object
      role_id,
      store_id,
      image: req.file ? req.file.filename : null, // Save the file path to the user object
    });

    // Save the user to the database
    await newUser.save();

    // Update remaining user count in package content
    packageContent.remaining_user -= 1;
    await packageContent.save();

    res.status(201).json(prepareSuccessResponse(newUser, "User created successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};


exports.users = async (req, res) => {
  try {
    let { page, size, sort, filter } = req.query;

    let { store_id } = req.params

    // Default values if not provided in the query
    page = parseInt(page) || 1;
    size = parseInt(size) || 10;
    sort = sort || '-created_at';
    filter = filter && filter.search ? filter.search : ''; // Extract the search string from filter object

    // Calculate skip value for pagination
    const skip = (page - 1) * size;

    // Constructing the query object
    const query = { store_id };
    if (filter) {
      query.$or = [
        { first_name: { $regex: filter, $options: 'i' } },
        { last_name: { $regex: filter, $options: 'i' } },
        { email: { $regex: filter, $options: 'i' } },
        { phone: { $regex: filter, $options: 'i' } }
      ];
    }

    // Filter out users with the admin role
    query.role_id = { $ne: '65faf012e7c17907d5ef3b7c' };

    // Fetch users based on query parameters and populate the role
    const users = await User.find(query)
      .populate('role_id', 'name') // Populate the role_id field with role_name
      .sort(sort)
      .skip(skip)
      .limit(size);

    const totalRecords = await User.countDocuments();

    res.json(prepareSuccessResponse(users, "Users retrieved successfully", totalRecords));
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
}


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const store_id = req.params.store_id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const image = user.image;
    if (image) {
      fs.unlinkSync('public/image/' + image);
    }
    // Delete the user
    await User.findByIdAndDelete(userId);

    const updatedPackageContent = await PlanContent.findOneAndUpdate(
      {
        store_id: store_id,
        isPlanActive: true
      }, // Ensure remaining_products is greater than 0
      { $inc: { remaining_user: +1 } }, // Decrement remaining_products by 1
      { new: true } // Return the updated document
    );


    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updatedUserData },
      { new: true }
    )
    await user.save();

    return res.json(prepareSuccessResponse(updatedUser, "User updated successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};


exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId).populate('role_id', 'name');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from user object
    const { password, ...userDataWithoutPassword } = user.toObject();

    return res.json(prepareSuccessResponse(userDataWithoutPassword, "User retrieved successfully"));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
