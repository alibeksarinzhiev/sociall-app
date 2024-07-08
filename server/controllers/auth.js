import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async(req,res)=>{
    try{

        const {username,password} = req.body

        const isUsed = await User.findOne({username})

        if(isUsed){
            return res.status(402).json({
                message:'данный юзер нэйм занят'
            })
        }
        const salt =bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)

        const newUser = new User({
            username,
            password:hash,
        })
        const token = jwt.sign({
            id:newUser._id,
        },
        process.env.JWT_SECRET,
        {expiresIn:'30d'}
        )
        await newUser.save()

        res.json({
            newUser,
            token,
            message:'юзер успешно создан'
        })

    }catch(error){
            res.json({message:'ошибка при регистации юзера'})
    }
}

export const login = async(req,res)=>{
    try{
            const {username,password} = req.body

            const user = await User.findOne({username})

            if(!user){
                return res.json({
                    message:'такого юзера нет'
                })
            }

            const isPassCorrect = await bcrypt.compare(password,user.password)

            if(!isPassCorrect){
                return res.json({message:'неверный пароль'})
            }


            const token = jwt.sign({
                id:user._id,
                username,
            },
            process.env.JWT_SECRET,
            {expiresIn:'30d'}
            )
            res.json({
                token,
                user,
                message:'Вы вошли в систему'
            })
            

    }catch(error){
        res.json({message:'ошибка при логие'})
    }
}

export const getMe = async(req,res)=>{
    try{

        const user = await User.findById(req.userId)
        if(!user){
            return res.json({message:'такого юзера не существует'})
        }
        const token = jwt.sign(
            {
                id:user._id,
            },
            process.env.JWT_SECRET,
            {expiresIn:'30d'}
        )
        res.json({
            user,
            token
        })


    }catch(error){
        res.json({message:'нет доступа'})
    }
}