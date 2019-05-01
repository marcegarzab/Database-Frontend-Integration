// const uuid = require('uuid'); 
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let postSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true},
    publishDate: {type: String, required: true}
});

let post = mongoose.model('post', postSchema);

const PostActions = {
    getAllPosts : function(){
        return post.find()
        .then(posts => {
            return posts;
        })
        .catch(err => {
            throw new Error(err)
        })
    },

    getAuthorPosts : function(author){
        return post.find({author: author})
        .then(posts => {
            return posts;
        })
        .catch(err => {
            throw new Error(err)
        })
    },

    newPost : function(newPost){
        return post.create(newPost)
        .then(post => {
            return post;
        })
        .catch(err => {
            throw new Error(err)
        })
    },

    deletePost : function(postId){
        return post.deleteOne({_id: postId})
        .then( post => {
            return post;
        })
        .catch(err => {
            throw new Error(err)
        })
    },

    putPost : function(postId, postTitle, postContent, postAuthor, postPublishDate){
        return post.findByIdAndUpdate({_id: postId}, {$set:{title: postTitle, content: postContent, author: postAuthor, publishDate: postPublishDate}})
        .then(post => {
            return post;
        })
        .catch(err => {
            throw new Error(err);
        })
    }
};

module.exports = {PostActions};
