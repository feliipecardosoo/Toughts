const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static login(req,res) {
        res.render('auth/login')
    }
    static register(req,res) {
        res.render('auth/register')
    }
    static async registerPost (req,res) {
        const {name, email, password, confirmpassword} = req.body

        if (password != confirmpassword) {
            // mensagem pro Front!
            req.flash('message', 'As senhas nao conferem! Tente novamente.')
            res.render('auth/register')

            return
        }

        // Checando se o User existe!
        const checkIfUserExist = await User.findOne({where: {email: email} })

        if (checkIfUserExist) {
            // mensagem pro Front!
            req.flash('message', 'O e-mail já esta em uso!')
            res.render('auth/register')

            return
        }

        // create a password 
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user)

            // initialize session
            req.session.userid = createdUser.id

            req.flash('message', 'Usuario Criado!')

            req.session.save(() => {
            res.redirect('/')
            })
        } catch (err) {
            console.log(err)
        }    
    }
    static logout (req,res) {
        req.session.destroy()
        res.redirect('/login')
    }
}