const mongoose = require('mongoose')
const answerModel = require('../models/answer.model')
const questionModel = require('../models/question.model')
const userModel = require('../models/user.model')

module.exports = {
	addAnswer (req, res) {
		let newAnswer = new answerModel(req.body)
		newAnswer.save()
			.then(resultAnswer => {
					let _id = req.params.questionId
					questionModel.findByIdAndUpdate({_id}, {
							$push: {
									answers: resultAnswer._id
							}
					})
					.then(resultQuestion => {
						userModel.findByIdAndUpdate(resultAnswer.user, {
								$push: {
										answers: resultAnswer._id
								}
						})
						.then(resultUser => {
								res.status(200).json({
										message: 'success',
										resultAnswer,
										resultQuestion,
										resultUser
								})
						})
					})
			})
			.catch(err => {
					res.status(400).json({
							message: 'Cant post answer'
					})
			})
	},
	findAnswer(req, res) {
			console.log('masuk')
			console.log(req.params.id)
			answerModel.findById(req.params.id)
					.populate('user')
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
	deleteAnswer(req, res) {
		console.log('===========')
		answerModel
			.findByIdAndRemove(req.params.id)
			.exec()
			.then((result) => {
				console.log('1', result)
				return userModel.findByIdAndUpdate(result.user, {
						$pull: {
							questions: result._id
						}
					})   
			})
			.then(user => {
				console.log('2')
				return answerModel.deleteMany({
						questionId: req.params.id
					}).exec()
			})  
			.then(answer => {
				console.log('3')
				res.status(200).json({
					message: 'success',
					answer
				})
			})   
			.catch((err) => {
				console.log(err)
					res.status(400).json({
						message: 'failed',
						err
					})
				});
	},
	upVote(req, res) {
			console.log('masuk upvote')
			const user = req.headers.decoded.id
			console.log(req.params.id)
			console.log(user)
			answerModel.findById(req.params.id)
					.populate('user')
					.then(answer => {
							if (answer.user._id == user) {
									res.status(404).json({
											message: 'can\'t vote your own post'
									})
							} else {
								let isFound = false
								answer.likes.forEach(u => {
										if (u == user) {
												isFound = true
										}
								})
								answer.dislikes.forEach(u => {
										if (u == user) {
												isFound = true
										}
								})
								if (!isFound) {
										answerModel.findByIdAndUpdate(req.params.id, {
												$push: {
														likes: user
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
			answerModel.findById(req.params.id)
					.populate('user')
					.then(answer => {
							if (answer.user._id == user) {
									res.status(404).json({
											message: 'can\'t vote your own post'
									})
							} else {
								let isFound = false
								answer.likes.forEach(u => {
										if (u == user) {
												isFound = true
										}
								})
								answer.dislikes.forEach(u => {
										if (u == user) {
												isFound = true
										}
								})
								if (!isFound) {
										answerModel.findByIdAndUpdate(req.params.id, {
												$push: {
														dislikes: user
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