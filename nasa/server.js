// Import express app
const express = require('express');

// Create a server
const server = express();

// Morgan library
const morgan = require('morgan');

// Vier Engine and templates registration
server.set('view engine', 'ejs');
server.set('views', 'templates');

// Use of morgan library to register the folders that will be used in front-end
server.use(morgan('dev'));
server.use(express.static('templates'));
server.use(express.static('Image'));

server.use((req, res, next) => {
    console.log('A Request Has Been Reached');
    console.log('---------------------------');
    console.log("URL: " + req.url);
    console.log("Hostname:" + req.hostname);
    console.log("Method:" + req.method);
    console.log("Path: " + req.path);
    console.log("");
    next();
})

// Database
const mongoose = require('mongoose');

//Connect to databas
const db = 'mongodb+srv://simondb:0nodedb1@node.wdbxttz.mongodb.net/nasa?retryWrites=true&w=majority';
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {
    server.listen(3000);
    console.log('Database Has Joined');
})
.catch((err) => {
    console.log("Error: " + err);
})

//Encodes the requested data
server.use(express.urlencoded({ extend: true }));

// Import model
const Blog = require('./models/blog');
const { template } = require('lodash');

// Routing dynamic
//Home page
server.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', {title: "Home Page", blogs: result});
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
});

// Post method
server.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
    .then((result) => {
        res.redirect('/');
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
});

// Create a blog
server.get('/blogs/create', (req, res) => {
    res.render('create', {title: "Creataion"});
});

// Blog Detail
server.get('/blogs/:id', (req, res) => {
    const blogID = req.params.id;
    Blog.findById(blogID)
    .then((result) => {
        res.render('detail', {title: blogID, blog: result})
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
});

// Delete a blog
server.delete('/blogs/:id', (req, res) => {
    const blogID = req.params.id;
    Blog.findByIdAndDelete(blogID)
    .then((result) => {
        res.json({redirect: '/blogs'});
    })
    .catch((err) => {
        console.log("Error: " + err);
    });
});

// Routing Static page
// Home page
server.get('/', (req, res) => {
    res.redirect('/blogs');
});

// About page
server.get('/about', (req, res) => {
    res.render('about', {title: "About"});
});

// 404 page
server.use((req, res) => {
    res.render('error', {title: 404});
});