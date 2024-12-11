import { User } from "../models/user.js";
import { Cart } from "../models/cart.js";
import nodemailer from 'nodemailer';
const getAllUsers = async (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json({
        message: "All users fetched successfully",
        allUser: users,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error fetching users",
        error: err,
      });
    });
};

const registerAsSeller = async (req, res) => {
  try {
    // Validate input data
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Create the user with role 'Seller'
    const userToAdd = new User({
      ...req.body,
      role: "Seller",
    });

    // Save user and create a cart in a transaction (if possible in your database setup)
    const user = await userToAdd.save();

    // Create an empty cart for the user
    const cart = await Cart.create({
      userId: user._id,
      items: [],
      totalPrice: 0,
      createdAt: new Date(),
    });

    // Respond with a success message
    return res.status(200).json({
      message: "User added as seller successfully",
      user,
      cart,
    });
  } catch (err) {
    // Log the error (optional) and respond with an error status
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while registering the user as a seller",
    });
  }
};

const registerAsBuyer = async (req, res) => {
  try {
    // Validate input data
    if (!req.body || !req.body.email || !req.body.password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Create the user with role 'Seller'
    const userToAdd = new User({
      ...req.body,
      role: "Buyer",
    });

    // Save user and create a cart in a transaction (if possible in your database setup)
    const user = await userToAdd.save();

    // Create an empty cart for the user
    const cart = await Cart.create({
      userId: user._id,
      items: [],
      totalPrice: 0,
      createdAt: new Date(),
    });

    // Respond with a success message
    return res.status(200).json({
      message: "User added as seller successfully",
      user,
      cart,
    });
  } catch (err) {
    // Log the error (optional) and respond with an error status
    console.error(err);
    return res.status(500).json({
      error: "An error occurred while registering the user as a seller",
    });
  }
};

const login = async (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        if (user.password === req.body.password) {
          res.status(200).json({
            message: "Login successful",
            userExist: true,
            correctPassword: true,
            userRole: user.role,
            user_id: user._id,
            user_name: `${user.firstName} ${user.lastName}`,
          });
        } else {
          res.status(200).json({
            message: "Wrong password",
            userExist: true,
            correctPassword: false,
          });
        }
      } else {
        res.status(200).json({
          message: "User does not exist",
          userExist: false,
          correctPassword: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
const getuserById = async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "User fetched by ID successfully",
          user,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const uploadUserProfile = async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        user.profilePhoto = req.body.profilePhoto;
        return user.save();
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .then((user) => {
      res.status(200).json({
        message: "Successfully added profile pic",
        user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const editUser = async (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "User info edited successfully",
          userInfo: user,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const getUserProfile = async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "Fetched profile pic successfully",
          profilePic: user.profilePhoto,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const delteUserById = async (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "User deleted successfully",
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

const otpVerification = async (req, res) => {
  const { emailId, username, otp } = req.body;

  // Validate input
  if (!emailId || !username || !otp) {
    return res.status(400).json({
      error: 'Email, username, and OTP are required fields.'
    });
  }

  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Store email in environment variable
      pass: process.env.EMAIL_PASS,  // Store password in environment variable
    }
  });

  // Email options
  const mailOptions = {
    from: '"Blossom Bazar" <farah.hashmi13sk@gmail.com>', // Sender address
    to: emailId, // Recipient address
    subject: 'OTP Verification', // Subject line
    text: `Hello ${username},\nWelcome to our website! We're excited to have you join us.`,
    html: `<h2>OTP: ${otp}</h2><p>Thank you for registering on our website.</p>`
  };

  try {
    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);

    // Respond with success
    return res.status(200).json({
      message: 'OTP sent successfully!',
      info: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);

    // Respond with error
    return res.status(500).json({
      error: 'Failed to send OTP email. Please try again later.',
    });
  }
};

export {
  getAllUsers,
  registerAsBuyer,
  registerAsSeller,
  login,
  getuserById,
  uploadUserProfile,
  editUser,
  getUserProfile,
  delteUserById,
  otpVerification
};
