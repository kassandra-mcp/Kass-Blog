const express = require('express');
const router = express.Router();
const md5 = require('md5');
const nodemailer = require('nodemailer');

const Task = require('../models/task');
const Comentario = require('../models/comment');
const Recomendacion = require('../models/recomendaciones');


require('dotenv').config({path: 'variables.env'});

//Importar variables de entorno locales
router.get('/posts/:page', async (req, res, next) => {
  let perPage = 10;
  let page = req.params.page || 1;

  const tasks = await Task.find({}).sort({date: 'desc'}).skip((perPage * page) - perPage).limit(perPage).exec((err, tasks) =>{
    Task.count((err, count) => {
      if (err) return next(err);
      res.render('index', {tasks, current: page, pages: Math.ceil(count / perPage)});
    }) 
  })

});

router.get('/recom', async (req, res, next) => {
  //let perPage = 10;
  //let page = req.params.page || 1;

  const recoms = await Recomendacion.find({}).sort({date: 'desc'});
  res.render('recom', {recoms});

});

router.get('/', (req, res) => {
  res.render('aboutme');
});

router.get('/contactme', (req, res) => {
  res.render('contactme');
});

router.post('/send-email', (req, res) =>
{
  const output = `<h1> User Information </h1>
                  <ul>
                    <li> Username: ${req.body.name} </li>
                    <li> User email: ${req.body.email} </li>
                    <li> Phone: ${req.body.phone} </li>
                  </ul> 
                  <p> ${req.body.message} </p>`;

  var transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    post: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD
    }
  });

  var mailOptions = {
    from: "Remitente",
    to: process.env.USERTO,
    subject: "Enviado desde nodemailer",
    text: "IT WORKS",
    html: output
  }

  transporter.sendMail(mailOptions, function(err, data) {
    if(err){
      console.log('Error Occurs');
    }
    else
    {
      console.log('Email sent'); 
      res.render('contactme');
    }
  })

});

router.get('/newpost', (req, res) => {
  res.render('newpost');
});

router.post('/add', async (req,res) => 
{
	const task = new Task(req.body);
	await task.save();	//save() es para que se almacene en la base de datos
	res.redirect('/');
});

router.get('/newrecoms', (req, res) => {
  res.render('newrecom');
});

router.post('/addrecom', async (req,res) => 
{
  const recom = new Recomendacion(req.body);
  await recom.save();  //save() es para que se almacene en la base de datos
  res.redirect('/recom');
});

router.get('/edit/:id', async (req, res, next) => 
{
  const task = await Task.findById(req.params.id);
  res.render('edit', { task });
});


router.post('/edit/:id', async (req, res, next) => 
{
  const { id } = req.params;
  await Task.update({_id: id}, req.body);
  res.redirect('/');
});

router.get('/readmore/:id', async (req, res) => 
{
  const postread = await Task.findById(req.params.id);
  if(postread)
  {
    postread.views = postread.views + 1;
    //res.json({likes: postread.likes})
    await postread.save();
  }

  res.render('readmore', {postread});

});

router.get('/readmore/:id/comment', async (req, res) => 
{
  const postread = await Task.findById(req.params.id); //Paso el ID del book
  const comments = await Comentario.find({post_id : postread._id});
  res.render('comment-post', {postread, comments});
});

router.post('/readmore/:id/comment', async (req, res) => 
{
  const postread = await Task.findById(req.params.id);  //ID del book
  if(postread)  //Sí el post existe crea el comentario
  {
    const newComment = new Comentario(
    {
      comment : req.body.comment,
      name: req.body.name,
      email: req.body.email
    });
    //newComment.gravatar = md5(newComment.email);
    newComment.post_id = postread._id;
    await newComment.save();
  
    res.redirect('/readmore/' + postread._id + '/comment');
  }
});

router.get('/readmore/:id/likes', async (req, res, next) => 
{
  const postread = await Task.findById(req.params.id);
  //console.log(postread);
  if (postread) 
  {
    postread.likes = postread.likes + 1;
    await postread.save();
    res.render('likes', {postread});
  } else {
    res.status(500).json({error: 'Internal Error'});
  }
});

router.get('/delete/:id', async (req, res, next) => 
{
  let { id } = req.params;
  await Task.remove({_id: id});
  res.redirect('/');
});

/****************************/

router.get('/readrecom/:id', async (req, res) => 
{
  const recomread = await Recomendacion.findById(req.params.id);
  
  const prueba = await Recomendacion.find(recomread._id);

  if( recomread)
  {
    recomread.views = recomread.views +1;
    await recomread.save();
    res.render('recomread', {recomread, prueba});
  }

});

router.get('/readrecom/:id/likes', async (req, res, next) => 
{
  const recomread = await Recomendacion.findById(req.params.id);

  const prueba = await Recomendacion.find(recomread._id);

  if (recomread) 
  {
    recomread.likes = recomread.likes + 1;
    await recomread.save();
    res.render('likesrecom', {recomread, prueba});
  } else {
    res.status(500).json({error: 'Internal Error'});
  }
});

router.get('/deleterecom/:id', async (req, res, next) => 
{
  let { id } = req.params;
  await Recomendacion.remove({_id: id});
  res.redirect('/recom');
});


module.exports = router;