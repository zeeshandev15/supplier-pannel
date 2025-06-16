import Customers from '../models/customerModel.js';

export const createCustomers = async (req, res) => {
  try {
    const { name, location, joinedDate, email, phone } = req.body;
    const image = req.file ? req.file.filename : null;
    const addCustomer = new Customers({
      name,
      location,
      joinedDate: joinedDate || new Date(),
      email,
      phone,
      image,
    });

    await addCustomer.save();
    res.status(201).json({ success: true, customer: addCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customers.find();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customers.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'customer not found!' });
    }
    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { name, joinedDate, location, email, phone } = req.body;
    const customerId = req.params.id;

    const updateData = {
      name,
      joinedDate,
      location,
      email,
      phone,
    };

    // ✅ Only add image field if a new file is uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedCustomer = await Customers.findByIdAndUpdate(customerId, updateData, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found!',
      });
    }

    res.status(200).json({ success: true, customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customers.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ success: false, message: 'Customer not found!' });
    }

    res.status(200).json({ success: true, message: 'Customer deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
