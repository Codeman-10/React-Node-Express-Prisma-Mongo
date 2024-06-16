import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "logout failed!" });
  }
  return res;
};
export const getUser = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "logout failed!" });
  }
  return res;
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, ...inputs } = req.body;
  let updatedPassword = null;
  console.log(id, tokenUserId, password);
  if (id !== tokenUserId) {
    return res.status(403).json({ message: "not Aothrized" });
  }
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(password && { password: updatedPassword }),
      },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "logout failed!" });
  }
  return res;
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  console.log(id,tokenUserId)
//   if (id !== tokenUserId) {
//     return res.status(403).json({ message: "not Authorized" });
//   }
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    res.status(200).json(deletedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "logout failed!" });
  }
  return res;
};
