const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const { User, Account } = require("../db");
const { authMiddleware } = require("./middleware");
const { JWT_SECRET } = require("../config");

const router = express.Router();

const signupSchema = z.object({
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string()
})

const signinSchema = z.object({
    username: z.string(),
	password: z.string()
})

const updateSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional()
})

router.post("/signup", async (req, res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if (!success) {
        return res.json({
            msg:"email already exist / incorrect input"
        })
    }
    const user = User.findOne({
        username: body.username
    })

    if(user._id){
        return res.json({
            msg:"email already exist / incorrect input"
        })
    }

    const dbUser = await User.create(body);
    const userId = dbUser._id;

    // Account hardcoded to user
    await Account.create({
        userId,
        balance : 1 + Math.random()*10000
    })

    //
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    

    res.json({
        msg: "User created successfully",
        token: token
    })
})


router.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})    


router.put("/", authMiddleware, async(req, res)=>{
    const {success} = updateSchema.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            msg: "Error while updating info"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        msg: "Updated info"
    })
})


router.get("/bulk",  async(req, res) => {
    const filter = req.query.filter || "";  

    const users = await User.find({
        $or:[{
            firstName: {
                "$regex": filter
            }
        },{
            lastName: {
            "$regex":filter
            }
        }]
    })
    res.json({
        user:   users.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router;