import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController {

    static createAccount = async (req : Request, res : Response) => {
        try {
            const { password, email } = req.body
            // Prevenir duplicados
            const userExists = await User.findOne({email})
            if (userExists) {
                const error = new Error('El usuario ya está registrado')
                return res.status(409).json({error: error.message})
            }
            // Crea un usuario
            const user = new User(req.body)
            // Hash password
            user.password = await hashPassword(password)
            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            // Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada correctamente, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req : Request, res : Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({error: error.message})
            }
            const user = await User.findById(tokenExists.user)
            user.confirm = true
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req : Request, res : Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({email})
            if (!user) {
                const error = new Error('El usuario no existe')
                return res.status(404).json({error: error.message})
            }
            if (!user.confirm) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                const error = new Error('La cuenta no ha sido confirmada, hemos enviado un email de confirmación')
                return res.status(401).json({error: error.message})
            }
            // Revisar contraseá
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const error = new Error('La contraseña es incorrecta')
                return res.status(401).json({error: error.message})
            }
            const token = generateJWT({id: user.id})
            res.send(token)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static requestConfirmationCode = async (req : Request, res : Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({email})
            if (!user) {
                const error = new Error('El usuario no está registrado')
                return res.status(404).json({error: error.message})
            }
            if (user.confirm) {
                const error = new Error('El usuario ya ha confirmado su cuenta')
                return res.status(403).json({error: error.message})
            }
            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            // Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            await Promise.allSettled([user.save(), token.save()])
            res.send('Se ha enviado un nuevo código a tu email')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static forgotPassword = async (req : Request, res : Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({email})
            if (!user) {
                const error = new Error('El usuario no está registrado')
                return res.status(404).json({error: error.message})
            }
            // Generar el token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()
            // Enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            res.send('Se ha enviado un email con las intrucciones')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static validateToken = async (req : Request, res : Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({error: error.message})
            }
            res.send('Token válido, define tu nueva contraseña')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updatePasswordWithToken = async (req : Request, res : Response) => {
        try {
            const { token } = req.body
            const { password } = req.body
            const tokenExists = await Token.findOne({token})
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(404).json({error: error.message})
            }
            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(password)
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Contraseña modificada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static user = async (req : Request, res : Response) => {
        return res.json(req.user)
    }

    static updateProfile = async (req : Request, res: Response) => {
        const { name, email } = req.body
        const userExists = await User.findOne({email})
        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('El email ya está en uso')
            return res.status(409).json({error: error.message})
        }
        req.user.name = name
        req.user.email = email
        try {
            await req.user.save()
            res.send('Perfil actualizado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateCurrentUserPassword = async (req : Request, res: Response) => {
        const { current_password, password } = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña actual no es correcta')
            return res.status(401).json({error: error.message})
        }
        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('Contraseña actualizada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static checkPassword = async (req : Request, res: Response) => {
        const { password } = req.body
        const user = await User.findById(req.user.id)
        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('La contraseña no es correcta')
            return res.status(401).json({error: error.message})
        }
        res.send('Contraseña correcta')
    }
}