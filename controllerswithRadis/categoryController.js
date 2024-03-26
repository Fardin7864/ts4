
const redis = require('redis');
const client = redis.createClient();

exports.getAllCategories = async (req, res, next) => {
    try {
        // Check if data exists in cache
        client.get('categories', async (err, categories) => {
            if (err) throw err;

            if (categories) {
                // If cached data exists, return it
                res.json(JSON.parse(categories));
            } else {
                // If not cached, fetch from database
                const categoriesFromDB = await Category.find().populate('parent');
                
                // Set data in cache
                client.setex('categories', 3600, JSON.stringify(categoriesFromDB));
                
                res.json(categoriesFromDB);
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    const { name, parent } = req.body;
    try {
        const category = new Category({ name, parent });
        const newCategory = await category.save();

        // Clear cache
        client.del('categories');

        res.status(201).json(newCategory);
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { name, parent, active } = req.body;

    try {
        // Clear cache
        client.del('categories');

        let updatedCategory;

        // If the category is being deactivated, deactivate all child categories recursively
        if (!active) {
            await deactivateChildCategories(id);
        }
        if (active) {
            await activateChildCategories(id);
        }

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
        await deactivateChildCategories(category._id); // Recursively deactivate child categories
    }
}

async function activateChildCategories(parentId) {
    const childCategories = await Category.find({ parent: parentId });

    for (const category of childCategories) {
        await Category.findByIdAndUpdate(category._id, { active: true });
        await activateChildCategories(category._id); // Recursively activate child categories
    }
}
