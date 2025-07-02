const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middlewares/upload');
const { validateJWT, checkRole } = require('../middlewares/auth.middleware');




router.get('/dealer/:dealerId/posts', postController.getAllPosts);

router.get('/dealer/:dealerId/posts/search', postController.searchPosts);

router.get('/dealer/:dealerId/posts/:postId', postController.getPostById);

router.post('/dealer/:dealerId/posts', upload.array('images', 10), validateJWT,  checkRole('dealer'), postController.createPost);

router.put(
    '/dealer/:dealerId/posts/:postId',  validateJWT, checkRole('dealer'), upload.array('images', 10),  postController.updatePost );

router.delete('/dealer/:dealerId/posts/:postId', validateJWT, checkRole('dealer'), postController.deletePost);

module.exports = router;
