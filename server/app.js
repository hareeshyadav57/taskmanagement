const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const fileupload = require('express-fileupload');

const app = express();
app.use(express.json());
app.use(cors());

app.use(fileupload());

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on the port number ${PORT}`));

//Configuration (MONGODB)
var curl = "mongodb://localhost:27017";
var client = new MongoClient(curl); 

//TESTING
app.get('/tms/test', async function(req, res){
    res.json("Testing Task Management System..");
});

app.post('/tms/post', async function(req, res){
    //res.json(req.body);
    res.json("Testing Post in Task Management System..");
});

//REGISTRATION MODULE
app.post('/registration/signup', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.insertOne(req.body);
        conn.close();
        res.json("Registered successfully...");
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//LOGIN MODULE
app.post('/login/signin', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.count(req.body);
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/registration/check-email', async function(req, res){
        try
        {
            conn = await client.connect();
            db = conn.db('tms');
            users = db.collection('users');
            data = await users.count(req.body);
            conn.close();
            res.json(data);
        }catch(err)
        {
            res.json(err).status(404);
        }
    });

//HOME MODULE
app.post('/home/uname', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.find(req.body, {projection:{firstname: true, lastname: true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/adminhome/uname', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.find(req.body, {projection:{firstname: true, lastname: true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/adminhome/deleteuser', async function(req, res){
    try {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        
        const { emailid } = req.body;

        const result = await users.deleteOne({ emailid: emailid });
        
        conn.close();
        
        if (result.deletedCount === 1) {
            res.json("User Deleted successfully...");
        } else {
            res.status(404).json({ error: 'User not found or could not be deleted.' });
        }
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/adminhome/viewusers', async function(req, res){
    try {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.find({}, {projection: {firstname: true, lastname: true, emailid: true, contactno: true}}).toArray();
        conn.close();
        res.json(data);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/adminhome/updateuser', async function(req, res){
    try {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');

        const { emailid, firstname, lastname, contactno, newemail } = req.body;

        // Construct the update object based on provided fields
        let updateData = {};
        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;
        if (contactno) updateData.contactno = contactno;
        if (newemail) updateData.emailid = newemail;

        // Update the user information in the database
        const result = await users.updateOne({ emailid: emailid }, { $set: updateData });

        if (result.modifiedCount === 1) {
            res.status(200).json("User information updated successfully.");
        } else {
            res.status(404).json("User not found or no changes applied.");
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message);
    }
});

app.post('/todo/add', async function(req, res){
    try {
        conn = await client.connect();
        db = conn.db('tms');
        tasks = db.collection('tasks');

        const { emailid, todoList } = req.body;

        // Update the existing document by appending new todo tasks
        const result = await tasks.updateOne(
            { emailid: emailid },
            { $push: { todoList: { $each: todoList } } },
            { upsert: true } // Creates a new document if not found
        );

        if (result.modifiedCount === 1 || result.upsertedCount === 1) {
            res.status(200).json("Todo tasks added successfully.");
        } else {
            res.status(404).json("Failed to add todo tasks.");
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message);
    }
});

app.get('/todo/:emailid', async function(req, res) {
    try {
        const emailid = req.params.emailid; // Get email ID from request parameters
        conn = await client.connect();
        db = conn.db('tms');
        tasks = db.collection('tasks');

        // Find document with specified email ID
        const result = await tasks.findOne({ emailid: emailid });

        if (result) {
            res.status(200).json(result.todoList); // Send todoList items if document found
        } else {
            res.status(404).json("Todo list not found."); // Send error if document not found
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message); // Send error message if an exception occurs
    }
});

app.delete('/todo/delete/:emailid/:index', async function(req, res) {
    try {
        const emailid = req.params.emailid; // Get email ID from request parameters
        const index = parseInt(req.params.index); // Get index of the todo item to delete
        conn = await client.connect();
        db = conn.db('tms');
        tasks = db.collection('tasks');

        // Find document with specified email ID
        const result = await tasks.findOne({ emailid: emailid });

        if (result) {
            const todoList = result.todoList;
            if (index >= 0 && index < todoList.length) {
                todoList.splice(index, 1); // Remove the todo item at the specified index
                // Update the document with the modified todoList
                await tasks.updateOne({ emailid: emailid }, { $set: { todoList: todoList } });
                res.status(200).json("Todo item deleted successfully.");
            } else {
                res.status(404).json("Todo item not found at the specified index.");
            }
        } else {
            res.status(404).json("Todo list not found.");
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message); // Send error message if an exception occurs
    }
});

//DOING MODULE
app.post('/doing/add', async function(req, res){
    try {
        conn = await client.connect();
        db = conn.db('tms');
        doings = db.collection('tasks');

        const { emailid, doingList } = req.body;

        // Update the existing document by appending new doing tasks
        const result = await doings.updateOne(
            { emailid: emailid },
            { $push: { doingList: { $each: doingList } } },
            { upsert: true } // Creates a new document if not found
        );

        if (result.modifiedCount === 1 || result.upsertedCount === 1) {
            res.status(200).json("Doing tasks added successfully.");
        } else {
            res.status(404).json("Failed to add doing tasks.");
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message);
    }
});

app.get('/doing/:emailid', async function(req, res) {
    try {
        const emailid = req.params.emailid; // Get email ID from request parameters
        conn = await client.connect();
        db = conn.db('tms');
        doings = db.collection('tasks');

        // Find document with specified email ID
        const result = await doings.findOne({ emailid: emailid });

        if (result) {
            res.status(200).json(result.doingList); // Send doingList items if document found
        } else {
            res.status(404).json("Doing list not found."); // Send error if document not found
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message); // Send error message if an exception occurs
    }
});

app.delete('/doing/delete/:emailid/:index', async function(req, res) {
    try {
        const emailid = req.params.emailid; // Get email ID from request parameters
        const index = parseInt(req.params.index); // Get index of the doing item to delete
        conn = await client.connect();
        db = conn.db('tms');
        doings = db.collection('tasks');

        // Find document with specified email ID
        const result = await doings.findOne({ emailid: emailid });

        if (result) {
            const doingList = result.doingList;
            if (index >= 0 && index < doingList.length) {
                doingList.splice(index, 1); // Remove the doing item at the specified index
                // Update the document with the modified doingList
                await doings.updateOne({ emailid: emailid }, { $set: { doingList: doingList } });
                res.status(200).json("Doing item deleted successfully.");
            } else {
                res.status(404).json("Doing item not found at the specified index.");
            }
        } else {
            res.status(404).json("Doing list not found.");
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message); // Send error message if an exception occurs
    }
});

// DONE MODULE
app.post('/done/add', async function(req, res){
    try {
        conn = await client.connect();
        db = conn.db('tms');
        dones = db.collection('tasks');

        const { emailid, doneList } = req.body;

        // Update the existing document by appending new done tasks
        const result = await dones.updateOne(
            { emailid: emailid },
            { $push: { doneList: { $each: doneList } } },
            { upsert: true } // Creates a new document if not found
        );

        if (result.modifiedCount === 1 || result.upsertedCount === 1) {
            res.status(200).json("Done tasks added successfully.");
        } else {
            res.status(404).json("Failed to add done tasks.");
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message);
    }
});

app.get('/done/:emailid', async function(req, res) {
    try {
        const emailid = req.params.emailid; // Get email ID from request parameters
        conn = await client.connect();
        db = conn.db('tms');
        dones = db.collection('tasks');

        // Find document with specified email ID
        const result = await dones.findOne({ emailid: emailid });

        if (result) {
            res.status(200).json(result.doneList); // Send doneList items if document found
        } else {
            res.status(404).json("Done list not found."); // Send error if document not found
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message); // Send error message if an exception occurs
    }
});

app.delete('/done/delete/:emailid/:index', async function(req, res) {
    try {
        const emailid = req.params.emailid; // Get email ID from request parameters
        const index = parseInt(req.params.index); // Get index of the done item to delete
        conn = await client.connect();
        db = conn.db('tms');
        dones = db.collection('tasks');

        // Find document with specified email ID
        const result = await dones.findOne({ emailid: emailid });

        if (result) {
            const doneList = result.doneList;
            if (index >= 0 && index < doneList.length) {
                doneList.splice(index, 1); // Remove the done item at the specified index
                // Update the document with the modified doneList
                await dones.updateOne({ emailid: emailid }, { $set: { doneList: doneList } });
                res.status(200).json("Done item deleted successfully.");
            } else {
                res.status(404).json("Done item not found at the specified index.");
            }
        } else {
            res.status(404).json("Done list not found.");
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message); // Send error message if an exception occurs
    }
});

app.get('/tasks/:emailid', async function(req, res) {
    try {
        const emailid = req.params.emailid; // Get email ID from request parameters
        conn = await client.connect();
        db = conn.db('tms');
        tasks = db.collection('tasks');

        // Find document with specified email ID
        const result = await tasks.findOne({ emailid: emailid });

        if (result) {
            res.status(200).json(result); // Send the entire document if found
        } else {
            res.status(404).json("Task list not found for this email ID."); // Send error if document not found
        }

        conn.close();
    } catch (err) {
        res.status(500).json(err.message); // Send error message if an exception occurs
    }
});


app.post('/home/menu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        menu = db.collection('menu');
        data = await menu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/adminhome/menu', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        menu = db.collection('adminmenu');
        data = await menu.find({}).sort({mid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/menus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        menus = db.collection('menus');
        data = await menus.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/adminhome/menus', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        menus = db.collection('adminmenus');
        data = await menus.find(req.body).sort({smid:1}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//CHANGE PASSWORD
app.post('/cp/updatepwd', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.updateOne({emailid : req.body.emailid}, {$set : {pwd : req.body.pwd}});
        conn.close();
        res.json("Password has been updated")
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//MY PROFILE
app.post('/myprofile/info', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.find(req.body).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});

//FILE UPLOAD
app.post('/uploaddp', async function(req, res){
    try
    {
        if(!req.files)
            return res.json("File not found");

        let myfile = req.files.myfile;
        var fname = req.body.fname;
        myfile.mv('../src/images/photo/'+ fname +'.jpg', function(err){
            if(err)
                return res.json("File upload operation failed!");

            res.json("File uploaded successfully...");
        });
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.updateOne({emailid : fname}, {$set : {imgurl : fname+'.jpg' }});
        conn.close();
    }catch(err)
    {
        res.json(err).status(404);
    }
});

app.post('/home/pic', async function(req, res){
    try
    {
        conn = await client.connect();
        db = conn.db('tms');
        users = db.collection('users');
        data = await users.find(req.body, {projection:{imgurl: true}}).toArray();
        conn.close();
        res.json(data);
    }catch(err)
    {
        res.json(err).status(404);
    }
});