require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require ('mongoose')
const Cliente = require ('./models/cliente')
app.use(bodyParser.json());
const cors = require('cors')

const {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_CLUSTER,
  MONGODB_HOST,
  MONGODB_DATABASE
} = process.env

mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.${MONGODB_HOST}.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`)
.then(() => {
  console.log("Conexão OK")
})
.catch((e) => {
  console.log("Conexão NOK: " + e)
})


app.use(cors())
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', "*");
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
//   next();
// })

//http://localhost:3000/api/clientes/123456
app.delete('/api/clientes/:id', (req, res) => {
  Cliente.deleteOne({_id: req.params.id}).then(resultado => {
    console.log(resultado)
    res.json({mensagem: "Cliente removido"})
  })
})


app.post('/api/clientes', (req, res, next) => {
  const cli = new Cliente (req.body)
  // const cliente = new Cliente({
  //   nome: req.body.nome,
  //   fone: req.body.fone,
  //   email: req.body.email
  // })
  cli.save().then(cliInserido => {
    res.status(201).json({
      mensagem: 'Cliente inserido',
      id: cliInserido._id
    });
  })
});

app.get('/api/clientes', (req, res, next) => {
  Cliente.find().then((documents) => {
    res.status(200).json({
      mensagem: 'Tudo OK',
      clientes: documents
    });
  })
});

module.exports = app;
