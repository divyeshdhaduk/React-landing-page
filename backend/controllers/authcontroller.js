const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Store = require('../models/Store')
const {
  prepareSuccessResponse,
  prepareErrorResponse,
} = require("../utils/responseHandler");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, store_name, image } =
      req.body;

    if (!first_name || !email || !password) {
      return res
        .status(401)
        .json(prepareErrorResponse("All fields are required"));
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(401)
        .json(prepareErrorResponse("User with this email already exists."));
    }

    const existingStore = await Store.findOne({ store_name: store_name });
    if (existingStore) {
      return res
        .status(401)
        .json(prepareErrorResponse("Store name is already exists"));
    }

    const startingDate = new Date();
    const endingDate = new Date(
      startingDate.getTime() + 30 * 24 * 60 * 60 * 1000
    ); // 30 days later

    let hashPassword = await bcryptjs.hash(password, 10);

    let user = new User({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashPassword,
      image: image,
    });

    await user.save();

    return res.json(
      prepareSuccessResponse(user, "User registered successfully")
    );
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res
        .status(401)
        .json(prepareErrorResponse("Invalid Email OR Password"));
    }

    // If the user is an admin, handle login differently
    if (user.isAdmin) {
      const isValid = bcryptjs.compare(password, user.password);
      if (!isValid) {
        return res
          .status(401)
          .json(prepareErrorResponse("Invalid Email OR Password"));
      } else {
        // Generate token for admin
        const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
          expiresIn: "24h",
        });

        // Construct the response object for admin
        const responseData = {
          token: token,
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            email_verified_at: user.email_verified_at,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            // status: user?.status,
            language: user.language,
            image: user.image,
            store_id: user.store_id,
            isAdmin: user.isAdmin,
          },
          // No permissions for admin
          permissions: [],
        };

        // Send the response for admin
        res.cookie("store_id", user.store_id, { maxAge: 24 * 60 * 60 * 1000 });
        return res.json(
          prepareSuccessResponse(responseData, "Logged in successfully")
        );
      }
    } else {
      // Handle login for non-admin users
      // Check store status
      const store = await Store.findById(user.store_id);
        // if (!store.status) {
        //   return res
        //     .status(401)
        //     .json(
        //       prepareErrorResponse(
        //         "Your store is not active, please contact admin"
        //       )
        //     );
        // }

      // Validate password
      const isValid = await bcryptjs.compare(password, user.password);
      if (!isValid) {
        return res
          .status(401)
          .json(prepareErrorResponse("Invalid Email OR Password"));
      }

      // Find user roles from Role model
      // const userRoles = await Roles.findById(user.role_id).populate({
      //   path: "permissions_id",
      //   select: "permissions",
      // });

      // Generate token
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: "24h",
      });

      // Construct the response object
      const responseData = {
        token: token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          email_verified_at: user.email_verified_at,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
          status: user.status,
          language: user.language,
          image: user.image,
          store_id: user.store_id,
        },
        // permissions: userRoles.permissions_id.permissions,
      };

      // Send the response
      // res.cookie("store_id", user.store_id, { maxAge: 24 * 60 * 60 * 1000 });
      return res.json(
        prepareSuccessResponse(responseData, "Logged in successfully")
      );
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    return res.json(prepareSuccessResponse("True", "logged out successfully"));
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in an hour
    await user.save();

    const resetUrl = `http://localhost:3000/#/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    transporter.sendMail({
      to: email,
      from: process.env.MAIL_USERNAME,
      subject: "Password Reset Request",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Request</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .logo {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .logo img {
                    width: 150px;
                    height: auto;
                }
                .message {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: white !important;
                    color: black !important;
                    text-decoration: none;
                    border-radius: 5px;
                    border:1px solid black;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">
                    <img src="https://infypos-staging.nyc3.digitaloceanspaces.com/settings/464/logo.png" alt="Your Company">
                </div>
                <div class="message">
                    <h2>Password Reset Request</h2>
                    <p>You recently requested to reset your password. Click the button below to reset your password.</p>
                    <a class="button" href="${resetUrl}">Reset Password</a>
                </div>
                <div class="footer">
                    <p>If you didn't request a password reset, please ignore this email.</p>
                    <p>If you need further assistance, please contact us at <a href="mailto:admin@yourcompany.com">admin@yourcompany.com</a>.</p>
                    <p>Thank you,<br>Ultra POS</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, password_confirmation } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (password === password_confirmation) {
      user.password = await bcryptjs.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();

      // Send password reset confirmation email
      sendResetConfirmationEmail(user.email);

      return res.status(200).json({ message: "Password reset successful" });
    } else {
      return res
        .status(401)
        .json({ message: "Password and confirm password not matched" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, current_password, new_password, confirm_password } =
      req.body;

    // Find the user by ID or any unique identifier
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password
    const isPasswordValid = await bcryptjs.compare(
      current_password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Validate the new password and its confirmation
    if (new_password !== confirm_password) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Hash the new password and update it in the user document
    const hashedPassword = await bcryptjs.hash(new_password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
