const express = require('express'),
      bodyParder = require('body-parser'),
      mongoDB = require('mongodb')
      objectId = require('mongodb').ObjectId;

//instanciando o modulo do express
let app = express();

//criando o middleware do body-parser
app.use(bodyParder.urlencoded({urlencoded:true}));
app.use(bodyParder.json());

//atribuindo uma porta para a api rodar
var port = 8080;

app.listen(port);

//criando conexão com o banco de dados mongodb
let conexao = mongoDB.Db(
  //nome do banco 'collection'
  'buscaController',
  new mongoDB.Server('localhost', 27017,{}),
  {}
);
console.log('Server On - port: '+port);

app.get('/',function (req, res) {
  res.send({msg:'API Consulta sites externos'});
});

//GET by CNPJ
app.get('/api/v1/resultado/cnpj/:cnpj', function (req, res) {
  conexao.open(function (err, mongoclient) {
    mongoclient.collection('consulta', function (err, collection) {
      collection.find({cnpj:req.params.cnpj}).toArray(function (err, results) {
        if (err) {
          res.status(400).json({status:'ERROR', message :'CNPJ nao encontrado'});
        } else {
          res.json(results);
        }
        mongoclient.close();
      });
    });
  });
});

//POST
app.post('/api/v1/consulta/cnpj', function (req, res) {
  let consulta = req.body;
  conexao.open(function (err, mongoclient) {
    mongoclient.collection('consulta', function (err, collection) {
      collection.insert(consulta, function (err, records) {
        if (err) {
          res.status(400).json({status:'Erro'});
        } else {
          res.json({status:'inclusao realizada com sucesso'});
        }
        mongoclient.close();
      });
    });
  });
});

//PUT by id
app.put('/api/v1/atualiza/cnpj/:id', function (req, res) {
  conexao.open(function (err, mongoclient) {
    mongoclient.collection('consulta', function (err, collection) {
      collection.update(
        { _id : objectId(req.params.id) },
        { $set : req.body},
        {},
        function (err, records) {
          if (err) {
            res.status(400).json(err);
          } else {
            res.json(records);
          }
        });
    });
  });
});

//DELETE by id(Remover)
app.delete('/api/v1/remove/cnpj/:id', function (req, res) {
  conexao.open(function (err, mongoclient) {
    mongoclient.collection('consulta', function (err, collection) {
      collection.remove({_id: objectId(req.params.id)}, function(err, records) {
        if (err) {
          res.status(400).json(err);
        } else {
          res.json(records);
        }
        mongoclient.close();
      });
    });
  });
});