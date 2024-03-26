
const Category = require('../models/Category');

exports.getAllCategories = async (req, res, next) => {
    try {
        const { parent } = req.query;
        let query = {};

        if (parent) {
            query.parent = parent;
        } else {
            query.parent = null;
        }

        const categories = await Category.find(query).populate('parent');
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

exports.getChildCategories = async (req, res, next) => {
    const { parentId } = req.params;

    try {
        const childCategories = await Category.find({ parent: parentId });
        res.json(childCategories);
    } catch (error) {
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    const { name, parent } = req.body;
    try {
        const category = await Category.create({ name, parent });
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};


exports.updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { name, parent, active } = req.body;

    try {
        let updatedCategory;

        // If the category is being deactivated, deactivate all child categories recursively
        if (!active) {
            await deactivateChildCategories(id);
        }
        // If the category is being activated, activate all child categories recursively
        if(active){
            await activateChildCategories(id);
        }

        // Update the category
        updatedCategory = await Category.findByIdAndUpdate(id, { name, parent, active }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // If the parent is being updated, deactivate old parent's child categories
        if (parent && parent !== updatedCategory.parent) {
            await deactivateChildCategories(updatedCategory.parent);
        } else if (active && parent !== updatedCategory.parent) {
            await activateChildCategories(parent);
        }

        res.json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

async function deactivateChildCategories(parentId) {
    const childCategories = await Category.find({ parent: parentId });

    for (const category of childCategories) {
        await Category.findByIdAndUpdate(category._id, { active: false });
        // Recursively deactivate child categories
        await deactivateChildCategories(category._id); 
    }
}

async function activateChildCategories(parentId) {
    const childCategories = await Category.find({ parent: parentId });

    for (const category of childCategories) {
        await Category.findByIdAndUpdate(category._id, { active: true });
        // Recursively activate child categories
        await activateChildCategories(category._id); 
    }
}

exports.deleteCategory = async (req, res, next) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error);
    }
};
