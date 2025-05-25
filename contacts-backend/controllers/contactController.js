const asyncHandler = require("express-async-handler");
const Contacts = require("../models/contactModal");

//@desc Get all contacts
//@route Get /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contacts.find({user_id:req.user.id});
  res.status(200).json(contacts);
});

//@desc Create New contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log(" the Request body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const contact = await Contacts.create({
    name,
    email,
    phone,
    user_id:req.user.id
  });
  res.status(201).json(contact);
});

//@desc Create New contacts
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc Update contacts
//@route PUT /api/contacts
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contacts.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  if(contact.user_id.toString()!==req.user.id){
    res.status(403);
    throw new Error("User does not have the permission to update other user contacts");
  }
  const updatedContact = await Contacts.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc Update contacts
//@route DELETE /api/contacts
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contacts.findByIdAndDelete(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
    if(contact.user_id.toString()!==req.user.id){
    res.status(403);
    throw new Error("User does not have the permission to update other user contacts");
  }
  await Contacts.deleteOne({_id:req.params.id})
  res.status(200).json(contact);
});

module.exports = {
  getContact,
  createContact,
  getContacts,
  deleteContact,
  updateContact,
};
