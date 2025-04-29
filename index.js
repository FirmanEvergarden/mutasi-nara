import axios from 'axios';
import fs from 'fs';
import moment from 'moment-timezone';
import chalk from 'chalk';
import express from 'express';

const merchant_id = 'OK2353745';
const merchant_code = '894916017447387782353745OKCT33ED157A61A41108EB5B367883E0A0F8';

async function fetch() {
  try {
    let anu = await axios.get(`https://gateway.okeconnect.com/api/mutasi/qris/${merchant_id}/${merchant_code}`);
    let res = anu.data;
    fs.writeFileSync('mutasi.json', JSON.stringify(res, null, 2));
    let currentTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
    console.log(chalk.green.bold('INFO ') + chalk.green.bold(`[`) + chalk.white.bold(`${currentTime}`) + chalk.green.bold(`]: `) + chalk.cyan('Data saved to mutasi.json'));
  } catch (error) {
    console.error(chalk.red('Error fetching or saving data:'), error);
  }
}

async function run() {
  await fetch();
  console.log(chalk.yellow('Waiting for 6 seconds before next fetch...'));
  setTimeout(run, 6000);
}
run();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

app.get('/mutasi.json', (req, res) => {
  res.sendFile(process.cwd() + '/mutasi.json');
});

app.listen(port, () => {
  console.log(chalk.green(`Server berjalan di port ${port}`));
});
