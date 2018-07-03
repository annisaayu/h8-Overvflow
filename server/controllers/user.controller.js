const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const userModel = require('../models/user.model')

const nodemailer = require("nodemailer");

const user = process.env.EMAIL
const pass = process.env.PASS

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${user}`,
    pass: `${pass}`
  }
});


const password_format_checker = function(password){
	const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
	return regex.test(password)
}

module.exports = {
	loginFB(req, res){
		console.log('masuk')
		let email = req.body.email
		console.log(req.body)
		userModel
			.findOne({email})
			.exec()
			.then(userData => {
				if(userData){
					let password = bcryptjs.compareSync(req.body.password, userData.password)
					console.log(password)
					if(password){
						let payload = {
							name: userData.name,
							username: userData.username,
							role: userData.role,
							id: userData._id
						}
						let Token = jwt.sign(payload, process.env.secret)
						res.status(200).json({
							message: 'Sign in success.',
							payload,
							token: Token
						})
					}else{
						res.status(201).json({
							message: 'Wrong password.'
						})
					}
				}else{
					let password = bcryptjs.hashSync(req.body.password, bcryptjs.genSaltSync(10))
					req.body.password = password
					let newUser = new userModel(req.body)
					newUser.save((err, result) => {
						if(err){
							res.status(201).json({
								message: 'Sign up failed.'
							})
						}else{
							let payload = {
								name: result.name,
								email: result.email,
								role: result.role,
								id: result._id
							}
							let Token = jwt.sign(payload, process.env.secret)
							res.status(200).json({
								message: 'Sign up and sign in success',
								token: Token,
								payload
							})
						}
					})
				}
			})
			.catch(err => {
					res.status(500).json({
							message: 'Server error.'
					})
			})
	},
	signIn (req, res) {
			console.log(req.body)
			let email = req.body.email
			userModel.findOne({email})
				.exec()
				.then(userData => {
					let password = bcryptjs.compareSync(req.body.password, userData.password)
					console.log(password)
					console.log(userData)
					if(password){
							console.log('udah masuk pass cek')
							let payload = {
									name: userData.name,
									email: userData.email,
									role: userData.role,
									id: userData._id
							}
							let Token = jwt.sign(payload, process.env.secret)
							res.status(200).json({
									message: 'Sign in success.',
									payload,
									token: Token
							})
					}else{
							res.status(401).json({
									message: 'Wrong password.'
							})
					}
				})
				.catch(err => {
						res.status(500).json({
								message: 'User Not Found'
						})
				})
	},
	signUp (req, res) {
			let password = req.body.password
			let email = req.body.email
			if(password_format_checker(password)){
					userModel.findOne({email})
						.exec()
						.then(userData => {
								if(userData){
										res.status(401).json({
												message: 'Email not unique'
										})
								}else{
									let password = bcryptjs.hashSync(req.body.password, bcryptjs.genSaltSync(10))
									req.body.password = password
									let newUser = new userModel(req.body)
									newUser.save((err, result) => {
											if(err){
													res.status(201).json({
															message: 'Sign up failed.'
													})
											}else{
													let mailOptions = {
															from: `Hacktiv Overflow`,
															to: `${result.email}`,
															subject: 'Thankyou for signing up!',
															text: 'Thankyou for signing up----'
														};
														transporter.sendMail(mailOptions, function(error, info){
															if (error) {
																console.log(error);
															} else {
																console.log('Email sent: ' + info.response);
															}
														})
													res.status(200).json({
															message: 'Sign up success.'
													})
											}
									})
								}
						})
						.catch(err => {
							res.status(500).json({
								message: 'Server error.'
							})
						})
			}else{
				res.status(403).json({
					message: 'Password minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
				})
			}
	}
}