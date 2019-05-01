//call getPosts function
$(function () {
	getPosts();
});

function getPosts() {
	$.ajax({
		url: './blog-posts',
		method: "GET",
		dataType: 'json',
		success: responseJson => displayPosts(responseJson.posts),
		error: err => postNotFound(err)
	});
}

//to display posts when needed
function displayPosts(post) {
	$('#displayPosts').empty();
	post.forEach(data => {
		$('#displayPosts').append(`
			<li>
				<p>Id:${data.post[i]._id}</p>
                <p>Title: ${data.post[i].title}</p>
                <p>Author: ${data.post[i].author}</p>
                <p>Content: ${data.post[i].content}</p>
                <p>Publish Date: ${data.post[i].publishDate}</p>
			</li>
		`);
	});
}

function addPost(newPost) {
	$('#displayPosts').prepend(`
		<li>
			<p>Id: ${newPost.post[i]._id}</p>
            <p>Title: ${newPost.post[i].title}</p>
            <p>Author: ${newPost.post[i].author}</p>
            <p>Content: ${newPost.post[i].content}</p>
            <p>Publish Date: ${newPost.post[i].publishDate}</p>
		</li>
	`);
}


//get by author
$('#authorButton').click(function () {
	let author = $('#authorInput').val();
	$.ajax({
		url: `./blog-posts/${author}`,
		method: "GET",
		dataType: 'json',
		success: responseJson => displayPosts(responseJson.listOfPosts),
		error: err => postNotFoundMsg(err)
	});
	$('#authorInput').val('');
});

//POST endpoint
$('#newButton').click(function() {
	let title = $('#postTitle').val();
	let author = $('#postAuthor').val();
	let content = $('#postContent').val();
	let publishDate = $('#postPublishDate').val();  

	let newPost = {
		title: title,
		author: author,
		content: content,
		publishDate: publishDate
	}

	if (validate(newPost)) {
		$.ajax({
			url: `./blog-posts/`,
			method: "POST",
			contentType: 'application/json',
			data: JSON.stringify(newPost),
			dataType: 'json',
			success: responseJson => addPost(responseJson.newPost),
			error: err => postNotFoundMsg(err)
		});
	}
	$('#postTitle').val('');
	$('#postAuthor').val('');
	$('#postContent').val('');
	$('#postPublishDate').val('');
});

//DELETE endpoint
$(document).on('click', '#deleteButton', function () {
	let id = $(this).closest('#idInput').attr('id');
	let postToDelete = {
		id: id
	}
	$.ajax({
		url: `./blog-posts/${id}`,
		method: "DELETE",
		contentType: 'application/json',
		data: JSON.stringify(postToDelete),
		dataType: 'json',
		success: responseJson => { 
			getPosts();
		},
		error: err => postNotFoundMsg(err)
	});
});

//PUT endpoint
$('#putButton').click(function () {
	let id = $('#postId2').val()
	if(id.length == 0) {
		alert("Missing Id");
		return;
	};
	let title = $('#postTitle2').val();
	let author = $('#postAuthor2').val();
	let content = $('#postContent2').val();
	let publishDate = $('#postDate2').val();

	let editPost = {
		title: title,
		author: author,
		content: content,
		publishDate: publishDate
	}

	if (validate(editPost)) {
		$.ajax({
			url: `./blog-posts/${id}`,
			method: "PUT",
			contentType: 'application/json',
			data: JSON.stringify(editPost),
			dataType: 'json',
			success: responseJson => {
				getPosts();
			},
			error: err => postNotFoundMsg(err)
		});
	}
	$('#postId2').val('');
	$('#postTitle2').val('');
	$('#postAuthor2').val('');
	$('#postContent2').val('');
	$('#postDate2').val('');
});

//validate inputs
function validate(data) {
	alertInfo = ["Missing"];
	if (data.title.length == 0) alertInfo.push("title");
	if (data.author.length == 0) alertInfo.push("author");
	if (data.content.length == 0) alertInfo.push("content");
	if (data.publishDate.length == 0) alertInfo.push("publishDate");
	if (alertInfo.length > 1) {
		alert(alertInfo);
		return false;
	} else {
		return true;
	}
}

//error message
function postNotFoundMsg(err) {
	$('#displayPosts').empty();
	$('#displayPosts').append(`
		<div class="ui negative message">
		  	<div class="header">
		    	<p>${err.status}</p>
			</div>
		 	<p>${err.responseJSON.message}</p>
		</div>
	`);
}
