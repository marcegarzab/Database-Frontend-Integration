const express = require('express');
const router = express.Router();
const {PostActions} = require('./blog-post-model');
const uuid = require('uuid'); 

// GET to check its working
router.get('/', (request, response) => {
    response.status(200).json({
        message: "Working!",
        status: 200
    });
});

// GET all posts
router.get('/blog-posts', (request, response, next) => {
	PostActions.getAllPosts()
	.then(posts => {
		response.status(200).json({
	        message: "Successfully sent all blog posts",
	        status: 200,
	        posts: posts
        });
	})
	.catch(err => {
		response.status(500).json({
	        message: "Internal server error",
	        status: 500
	    });
	    next();
	});
});


// GET all posts by author
router.get('/blog-posts/:author', (request, response) => {
	let postAuthor = request.params.author;

	if(!postAuthor){
		response.status(406).json({
			message: "missing author",
			status: 406
		});
	}

	PostActions.getAuthorPosts(postAuthor)
	.then(posts => {
		if(posts.length > 0){
			response.status(200).json({
				message: "Successfully sent the list of author posts",
				status: 200,
				post: posts
			});
		}
		else{
			response.status(404).json({
				message: "No author posts found",
				status: 404
			});
			next();
		}	
	})
	.catch(err => {
		response.status(500).json({
			message: 'Internal server error',
			status: 500
		});
		next();
	});
});

// POST a new blog post
router.post('/blog-posts', (request, response, next) => {
	let postTitle = request.body.title;
    let postContent = request.body.content;
    let postAuthor = request.body.author;
    let postPublishDate = request.body.publishDate;
    let fields = ['title', 'content', 'author', 'publishDate'];

    for (let x = 0; x < fields.length; x++){
    	let currentField = fields[x];
    	if(!(currentField in request.body)){
    		response.status(406).json({
    			message: `${currentField} is missing`,
    			status: 406
    		});
    		next()
    	}
    }

    let newPost = {
        id: uuid.v4(),
        title: postTitle,
        content: postContent,
        author: postAuthor,
        publishDate: postPublishDate
    };

    PostActions.newPost(newPost)
    .then(post => {
    	response.status(201).json({
    		message: "Successfully added post",
    		status: 201,
    		post: post
    	});
    })
    .catch(err => {
    	console.log(err);
    	response.status(500).json({
    		message: 'Internal server error',
    		status: 500
    	});
    	next();
    })    
});

//Delete post
router.delete('/blog-posts/:id', (request, response, next) => {
	let paramId = request.params.id;
	// let bodyId = request.body.id;

	PostActions.deletePost(paramId)
	.then(post => {
		response.status(200).json({
			message: "Successfully deleted post",
			status: 200
		});
	})
	.catch(err => {
		response.status(404).json({
			message: "Post not found",
			status: 404
		});
		next();
	})

	// if(!bodyId || !paramId || bodyId != paramId){
	// 	response.status(406).json({
	// 		message: "Missing id",
	// 		status: 406
	// 	});
	// 	return next();
});

// PUT
router.put('/blog-posts/:id', (request, response) => {
	let postId = request.params.id;
	let updatedPost = request.body;

	if(!postId){
		response.status(406).json({
			message: "Missing id",
			status: 404
		});
	}else{
		if(Object.keys(updatedPost).length == 4){
		// if(!updatedPost.title && !updatedPost.content && !updatedPost.author && !updatedPost.publishDate){
			response.status(404).json({
				message: "No data in body",
				status: 404
			});
		}else{
			PostActions.putPost(postId, updatedPost.title, updatedPost.content, updatedPost.author, updatedPost.publishDate)
			.then(post => {
				response.status(200).json({
					message: "Successfully updated post",
					status: 200,
					post: post			
				});
			})
			.catch(err => {
				response.status(404).json({
					message: "Post nos found",
					status: 404
				});
				next();
			})
		}

	}
});

module.exports = router;
