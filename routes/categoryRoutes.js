
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const categoryController = require('../controllerswithRadis/categoryController');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory); 
router.delete('/:id', categoryController.deleteCategory); 

// Route to get child categories of a specific parent category
router.get('/:parentId/children', categoryController.getChildCategories);


module.exports = router;
