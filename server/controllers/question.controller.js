const User = require('../models/user.model')
const Question = require('../models/question.model')
const Answer = require('../models/answer.model')

module.exports = {
	addPost(req, res) {
		const user = req.headers.decoded.id
		const { title, content } = req.body
		Question.create({
			title,
			content,
			user
		}).then((result) => {
			User
				.findByIdAndUpdate(result.user, {
					$push: {
						questions: result._id
					}
				})
				.then(user => {
					res.status(200).json({
						message: 'success',
						result
					})
				})
		}).catch((err) => {
			res.status(400).json({
				message: 'failed',
				err
			})
		});
	},

	showPosts(req, res) {
		Question.find()
			.populate('user')
			.populate('answers')
			.then((result) => {
				res.status(200).json({
					message: 'success',
					result
				})
			}).catch((err) => {
				res.status(400).json({
					message: 'failed',
					err
				})
			});
	},

	findPost(req, res) {
		Question.findById(req.params.id)
			.populate('user')
			.populate('answers')
			.then((result) => {
				res.status(200).json({
					message: 'success',
					result
				})
			}).catch((err) => {
				res.status(400).json({
					message: 'failed',
					err
				})
			});
	},

	editPost(req, res) {
		const { title, content } = req.body
		Question
			.findByIdAndUpdate(req.params.id, {
				title,
				content,
			})
			.then((result) => {
				res.status(200).json({
					message: 'success',
					result
				})
			}).catch((err) => {
				res.status(400).json({
					message: 'failed',
					err
				})
			});
	},

	deletePost(req, res) {
		Question
			.findByIdAndRemove(req.params.id)
			.then((result) => {
				return User.findByIdAndUpdate(result.user, {
					$pull: {
						questions: result._id
					}
				})
			})
			.then(user => {
				return Answer.deleteMany({
						questionId: req.params.id
					})
					// .exec()
			})
			.then(answer => {
				res.status(200).json({
					message: 'success to delete post',
					result
				})
			})
			.catch((err) => {
				res.status(400).json({
					message: 'failed to delete post',
					err
				})
			});
	},
	
	upVote(req, res) {
			console.log('masuk upvote')
			const user = req.headers.decoded.id
			console.log(req.params.id)
			console.log(user)
			Question.findById(req.params.id)
					.populate('user')
					.then(question => {
							if (question.user._id == user) {
									res.status(404).json({
											message: 'can\'t vote your own post'
									})
							}
							let isFound = false
							question.upVote.forEach(u => {
									if (u == user) {
											isFound = true
									}
							})
							question.downVote.forEach(u => {
									if (u == user) {
											isFound = true
									}
							})
							if (!isFound) {
									Question.findByIdAndUpdate(req.params.id, {
											$push: {
													upVote: user
											}
									})
											.then((result) => {
													res.status(200).json({
															message: 'Success To Up Vote',
															result
													})
											})
							} else {
									res.status(401).json({
											message: 'failed you has already voted'
									})
							}
					})
					.catch((err) => {
							res.status(400).json({
									message: 'failed',
									err
							})
					});
	},
	downVote(req, res) {
			const user = req.headers.decoded.id
			Question.findById(req.params.id)
					.populate('user')
					.then(question => {
							if (question.user._id == user) {
									res.status(404).json({
											message: 'can\'t vote your own post'
									})
							}
							let isFound = false
							question.upVote.forEach(u => {
									if (u == user) {
											isFound = true
									}
							})
							question.downVote.forEach(u => {
									if (u == user) {
											isFound = true
									}
							})
							if (!isFound) {
									Question.findByIdAndUpdate(req.params.id, {
											$push: {
													downVote: user
											}
									})
											.exec()
											.then((result) => {
													res.status(200).json({
															message: 'Success To Down Vote',
															result
													})
											})
							} else {
									res.status(401).json({
											message: 'failed you has already voted'
									})
							}
					})
					.catch((err) => {
							res.status(400).json({
									message: 'failed',
									err
							})
					});
	}
}