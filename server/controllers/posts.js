import Post from '../models/Post.js'
import User from '../models/User.js'
import Comment from '../models/Comment.js'
import path,{dirname} from 'path'
import { fileURLToPath } from 'url'



export const createPost = async(req,res)=>{
    try {

        const {title,text} = req.body
        const user = await User.findById(req.userId)


        if(req.files){
            let fileName = Date.now().toString() + req.files.image.name
            const __dirname = dirname(fileURLToPath(import.meta.url))
            req.files.image.mv(path.join(__dirname,'..','uploads',fileName))
       

        const newPostWithImage = new Post({
            username:user.username,
            title,
            text,
            imgUrl:fileName,
            author:req.userId
        })

        await newPostWithImage.save()
        await User.findByIdAndUpdate(req.userId,{
            $push:{posts:newPostWithImage},
        })

        return res.json(newPostWithImage)
    } 

    const newPostWithoutImage = new Post({
        username:user.username,
        title,
        text,
        imgUrl:'',
        author:req.userId,
    })
    await newPostWithoutImage.save()
    await User.findByIdAndUpdate(req.userId,{
       $push :{posts:newPostWithoutImage},
    })

    return res.json(newPostWithoutImage)
        
    } catch (error) {
        return res.json({message:'ошибка при создании поста'})
    }
}

export const getAll = async (req,res)=>{
    try{
        const posts = await Post.find().sort('-createdAt')
        const popularPosts = await Post.find().limit(5).sort('-views')

        if(!posts){
            return res.json({message:'на сайте отсутвуют посты!'})
        }
        res.json({posts,popularPosts})
    }catch(err){
        res.json({message:'произошла ошибка при получении всех постов'})
    }
}

export const getById = async(req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 },
        })
        res.json(post) 
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

export const getMyPosts = async(req, res) => {
    try {
       const user = await User.findById(req.userId)
       const list = await Promise.all(
        user.posts.map((el)=>{
            return Post.findById(el._id)
            }),

       )
        res.json(list) 
    } catch (error) {
        res.json({ message: 'Что-то пошло не так.' })
    }
}

export const removePost = async(req, res) => {
    try {
       const post = await Post.findByIdAndDelete(req.params.id)
       if(!post){
        return res.json({message:'не удается найти этот пост'})
       }
       await User.findByIdAndUpdate(req.UserId,{
        $pull:{posts:req.params.id}
       })
        res.json({message:'пост успешно удален'}) 
    } catch (error) {
        res.json({ message: 'не удалось удалить пост.' })
    }
}


export const getPostComments = async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        const list = await Promise.all(
            post.comments.map((el)=>{
                return Comment.findById(el)
            })
        )
        res.json(list)

    }catch(err){
        res.json({message:'не удалось получить все комментарии к этмоу посту'})
    }
}