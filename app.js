const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const mongoUrl = 'mongodb+srv://admin:admin123@dev-server.2twyv.mongodb.net/dev-agendas2?retryWrites=true&w=majority';

app.use(express.json());

// Conecte-se ao banco de dados MongoDB
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDatabase() {
  try {
    await client.connect();
    console.log('Conectado ao banco de dados MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados', error);
  }
}

connectDatabase();

// Defina uma rota de exemplo
app.get('/teste', (req, res) => {
  res.send('Olá, mundo!');
});

app.get('/cartorios', async (req, res) => {
  try {
    const db = client.db('cartorios'); // Obtenha uma referência ao banco de dados
    const collection = db.collection('cartorios'); // Nome da coleção que você deseja acessar
    // Consulta para recuperar todos os documentos da coleção
    const result = await collection.find({}).toArray();
    // Envie a resposta com os documentos recuperados
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar cartorios do banco de dados', error);
    res.status(500).json({ error: 'Erro ao buscar cartorios do banco de dados' });
  }
});

app.get('/cartorio/:uf', async (req, res) => {
  try {
    const resposta = req.params.uf;
    const UpperRes = resposta.toUpperCase();

    const db = client.db('cartorios'); // Obtenha uma referência ao banco de dados
    const collection = db.collection('cartorios'); // Nome da coleção que você deseja acessar

    const query = { uf: UpperRes };

    // // Consulta para recuperar documentos da coleção com base no parâmetro "UF"
    let result = await collection.find(query).toArray();

    if(result.length === 0){
      res.status(404).json({ error: "Nenhum dado encontrado estados"});
    }else{

      res.json(result);
    }

    // // Envie a resposta com os documentos recuperados

  } catch (error) {
    console.error('Erro ao buscar cartorios do banco de dados', error);
    res.status(500).json({ error: 'Erro ao buscar cartorios do banco de dados' });
  }
});


app.get('/cartorio/:uf/:municipio', async (req, res) => {
  try {
    const uf = req.params.uf.toUpperCase(); // Obtenha a UF da URL e converta para maiúsculas
    const municipio = req.params.municipio; // Obtenha o município da URL

    const db = client.db('cartorios'); // Obtenha uma referência ao banco de dados
    const collection = db.collection('cartorios'); // Nome da coleção que você deseja acessar

    const query = { uf, municipio }; // Crie um objeto de consulta com a UF e o município

    // Consulta para recuperar documentos da coleção com base nos parâmetros "UF" e "municipio"
    let result = await collection.find(query).toArray();

    if (result.length === 0) {
      res.status(404).json({ error: "Nenhum dado encontrado municipios" });
    } else {
      res.json(result);
    }

  } catch (error) {
    console.error('Erro ao buscar cartorios do banco de dados', error);
    res.status(500).json({ error: 'Erro ao buscar cartorios do banco de dados' });
  }
});



app.listen(port, () => {
  console.log(`Servidor está executando na porta ${port}`);
});


//node app.js  para rodar o aplicativo
