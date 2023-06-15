import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";

const app = express();
const port = 5000;

app.use(cors({ exposedHeaders: ['Content-disposition'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);
app.get('/', (req, res) => {
  res.send('ping');
});

app.listen(port, () => {
  return console.log(`Express server is listening at http://localhost:${port}`);
});
