const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());


const connect = () => {
  return mongoose.connect(
  
    "mongodb+srv://ashutosh:abc1234@cluster0.tdnbx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  );
};


const userSchema = new mongoose.Schema(
  {
    firstName: {type:String,required:true},
     middleName: {type:String,required:false},
     lastName : {type:String,required:true},
     age : {type:Number,required:true},
     email : {type:String,required:true},
     address : {type:String,required:true},
     gender : {type:String,required:false,default:"Male"},
     type : {type:String,required:false,default:"Customer"},
     
  },
  {
    versionKey: false, 
    timestamps: true,}
);


const User = mongoose.model("user", userSchema); // user => users


const BD = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    IFSC: {
        MICR:{type: Number, required: true },
        type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }
    // [] ,
   
  },
  {
    versionKey: false, // removed __v
    timestamps: true, // createdAt, updatedAt
  }
);

const BranchDetail = mongoose.model("branch", BD); // post => master


const Master = new mongoose.Schema(
  {
    balance: { type: Number, required: true },
    master_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },  branch_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
        required: true,
      },
    
  },
  {
    versionKey: false, // removed __v
    timestamps: true, // createdAt, updatedAt
  }
);

const MasterAccount = mongoose.model("master", Master); 


const savingsSchema = new mongoose.Schema(
  {
    account_number: { type: Number, required: true, uniuqe:true },
     balance: { type: Number, required: true },
    interestRate: { type: String, required: true },
  
      master_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "master",
        required: true,
      },
   
  },
  {
    versionKey: false, // removed __v
    timestamps: true, // createdAt, updatedAt
  }
);

const SavingsAccount = mongoose.model("saving", savingsSchema); // tag => tags

const fd=new mongoose.Schema({
    account_number:{type:Number,required:true,unique:true},
    balance:{type:Number,required:true},
    interestRate:{type:String,required:true},
    startDate:{type:String,required:true},
    maturityDate:{type:String,required:true},
    master_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "master",
        required: true,
      },

},{
    versionKey:false,
    timestamps:true
});
const FixedAccount=mongoose.model("fds",fd);




app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);

    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/users", async (req, res) => {
  // thennable => proper then
  try {
    const users = await User.find().lean().exec(); // db.users.find() // proper promise

    return res.send(users);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// met + route => get /users/${variable} and the name of variable is id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();

    if (user) {
      return res.send(user);
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// met + route => patch /users/${variable} and the name of variable is id
app.patch("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// met + route => delete /users/${variable} and the name of variable is id
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean().exec();

    res.send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


app.post("/branch", async (req, res) => {
  try {
    const bd = await BranchDetail.create(req.body);

    return res.send(bd);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/branch", async (req, res) => {
  try {
    const bd = await BranchDetail.find().lean().exec();

    return res.send(bd);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/branch/:id", async (req, res) => {
  try {
    const bd = await BranchDetail.findById(req.params.id).lean().exec();

    return res.send(bd);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/branch/:id", async (req, res) => {
  try {
    const bd = await BranchDetail.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(bd);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/tags/:id", async (req, res) => {
  try {
    const bd = await BranchDetail.findByIdAndDelete(req.params.id);

    return res.send(bd);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


app.get("/master", async (req, res) => {
  try {
    const posts = await MasterAccount.find()
      .populate({ path: "user_id", select: ["first_name", "last_name"] })
      .populate({ path: "tag_ids", select: "name" })
      .lean()
      .exec();

    return res.send(posts);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/master", async (req, res) => {
  try {
    const master = await MasterAccount.create(req.body);

    return res.send(master);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/master/:id", async (req, res) => {
  try {
    const post = await MasterAccount.findById(req.params.id).lean().exec();

    return res.send(post);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/master/:id", async (req, res) => {
  try {
    const post = await MasterAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(post);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/master/:id", async (req, res) => {
  try {
    const post = await MasterAccount.findByIdAndDelete(req.params.id).lean().exec();

    return res.send(post);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});


app.get("/saving", async (req, res) => {
  try {
    const saving = await SavingsAccount.find()
      .populate({
        path: "post_id",
        select: ["title", "body"],
        populate: [
          { path: "user_id", select: ["first_name", "last_name"] },
          { path: "tag_ids", select: ["name"] },
        ],
      })
      .lean()
      .exec();

    return res.send(saving);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/saving", async (req, res) => {
  try {
    const comment = await SavingsAccount.create(req.body);

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/saving/:id", async (req, res) => {
  try {
    const comment = await SavingsAccount.findById(req.params.id).lean().exec();

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/saving/:id", async (req, res) => {
  try {
    const comment = await SavingsAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/saving/:id", async (req, res) => {
  try {
    const comment = await SavingsAccount.findByIdAndDelete(req.params.id)
      .lean()
      .exec();

    return res.send(comment);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/fixed", async (req, res) => {
    try {
      const fixed = await FixedAccount.find()
        .populate({
          path: "post_id",
          select: ["title", "body"],
          populate: [
            { path: "user_id", select: ["first_name", "last_name"] },
            { path: "tag_ids", select: ["name"] },
          ],
        })
        .lean()
        .exec();
  
      return res.send(fixed);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  app.post("/fixed", async (req, res) => {
    try {
      const comment = await FixedAccount.create(req.body);
  
      return res.send(comment);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  app.get("/fixed/:id", async (req, res) => {
    try {
      const comment = await FixedAccount.findById(req.params.id).lean().exec();
  
      return res.send(comment);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  app.patch("/fixed/:id", async (req, res) => {
    try {
      const comment = await FixedAccount.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
  
      return res.send(comment);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  app.delete("/fixed/:id", async (req, res) => {
    try {
      const comment = await FixedAccount.findByIdAndDelete(req.params.id)
        .lean()
        .exec();
  
      return res.send(comment);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
app.listen(4567, async function () {
  try {
    await connect();
    console.log("listening on port 4567");
  } catch (e) {
    console.log(e.message);
  }
});

