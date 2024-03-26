
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    active: { type: Boolean, default: true }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
