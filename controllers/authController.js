import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../utils/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import orderModel from "../models/orderModel.js";
dotenv.config();

//email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const registerController = async (req, res) => {
  try {
    const { name, email, password, mobile, address } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name Required" });
    }
    if (!email) {
      return res.send({ message: "Email Required" });
    }
    if (!password) {
      return res.send({ message: "Password Required" });
    }
    if (!mobile) {
      return res.send({ message: "Mobile Number Required" });
    }
    if (!address) {
      return res.send({ message: "Address Required" });
    }

    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(201).send({
        success: false,
        message: "Already Registered, please Login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      mobile,
      address,
      password: hashedPassword,
    }).save();

    res.status(200).send({
      success: true,
      message: "User registered succesfully, Please Login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//Login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Check Email and Password",
      });
    }
    //check user existing or not
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not registered, please register",
      });
    }

    //Invalid password
    const match = await comparePassword(password, existingUser.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    //token
    const token = await JWT.sign(
      { _id: existingUser._id },
      process.env.JWT_CODE,
      {
        expiresIn: "10d",
      }
    );

    res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        mobile: existingUser.mobile,
        address: existingUser.address,
        role: existingUser.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const testController = (req, res) => {
  res.send("protected");
};

//OTP controller
export const otpController = async (req, res) => {
  try {
    const { email } = req.body;
    //validations
    if (!email) {
      return res.send({ message: "Email Required" });
    }
    //check user existing or not
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not registered, please register",
      });
    }

    const OTP = Math.floor(1000 + Math.random() * 9000);
    await userModel.findByIdAndUpdate(
      { _id: existingUser._id },
      {
        otp: OTP,
      }
    );

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP to reset Password -Shop Easy",
      text: `OTP to reset your password is ${OTP}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          message: "error while sending OTP",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Email sent successfully",
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in sending OTP",
      error,
    });
  }
};

//password update

export const passwordController = async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;
    //validations
    if (!email) {
      return res.send({ message: "Email Required" });
    }
    if (!otp) {
      return res.send({ message: "OTP Required" });
    }
    if (!newpassword) {
      return res.send({ message: "New Password Required" });
    }
    //get user data
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "User not registered, please register",
      });
    }

    if (existingUser.otp == otp) {
      const hashedPassword = await hashPassword(newpassword);
      await userModel.findByIdAndUpdate(
        { _id: existingUser._id },
        {
          password: hashedPassword,
        }
      );
      res.status(200).send({
        success: true,
        message: "Password updated successfully",
      });
    } else {
      res.status(401).send({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

//add adreess
export const addAddressController = async (req, res) => {
  try {
    const { email, newaddress } = req.body;

    //validations
    if (!newaddress) {
      return res.send({ message: "address Required" });
    }

    const user = await userModel.findOneAndUpdate(
      { email },
      {
        $push: newaddress,
      }
    );
    console.log(user);
    res.status(200).send({
      success: true,
      message: "Address added successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while adding address",
    });
  }
};

//Get all adreess
export const getAddressController = async (req, res) => {
  try {
    const { email } = req.params;
    const { address } = await userModel.findOne({ email });

    res.status(200).send({
      success: true,
      message: "Getting address successfully",
      address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while adding address",
    });
  }
};

//delete address
export const deleteAddressController = async (req, res) => {
  try {
    const { email, addr } = req.body;

    const removed = await userModel.updateOne(
      { email },
      {
        $pull: { address: addr },
      }
    );

    res.status(200).send({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleteing Category",
    });
  }
};

//Update address
export const updateAddressController = async (req, res) => {
  try {
    const { email, index, newaddress } = req.body;
    console.log(email, index, newaddress);
    const updated = await userModel.updateOne(
      { email },
      {
        $set: { [`address.${index}`]: newaddress },
      }
    );

    res.status(200).send({
      success: true,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating Category",
    });
  }
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    //get user data
    if (user.email !== email) {
      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        return res.status(404).send({
          success: false,
          message: "User e-mail id already exist",
        });
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating profile",
      error,
    });
  }
};

//get all orders of a user
export const getuserOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate({
        path: "cart",
        populate: { path: "product" },
      })
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};

//get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate({
        path: "cart",
        populate: { path: "product" },
      })
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};
