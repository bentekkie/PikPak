import * as express from 'express'


const router = express.Router()

router.get('/',(req,res) => {
    console.log("hi")
    res.send({message:"hi"})
})

export const FeedRouter = router;