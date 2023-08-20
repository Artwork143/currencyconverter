
import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  res.render("index.ejs");
  // res.render("index.ejs", { content: "Waiting for data..." });
  });

app.post("/", async (req, res) => {
  const amount = req.body["amount"];
  const currency1 = req.body.currency[0];
  const currency2 = req.body.currency[1];
  let amountInput = amount*1;

  const currencySplitOne = currency1.split(' ');
  let currencyLengthOne = currencySplitOne.length;

  const currencySplitTwo = currency2.split(' ');
  let currencyLengthTwo = currencySplitTwo.length;

  console.log(currencySplitOne[currencyLengthOne-2]);
  console.log(currencySplitOne[currencyLengthOne-1]);
  
  console.log(currencyLengthOne);
  
  try {
    const response = await axios.get("https://v6.exchangerate-api.com/v6/76a1612d41a4332daae17e5c/latest/" + currencySplitOne[0]);
    const currency = response.data.conversion_rates[currencySplitTwo[0]];
    let convertedAmount = amount*currency;
    let currencyInputOne = currencySplitOne[currencyLengthOne-2] + " " + currencySplitOne[currencyLengthOne-1];
    let currencyInputTwo = currencySplitTwo[currencyLengthTwo-2] + " " + currencySplitTwo[currencyLengthTwo-1];

    convertedAmount = convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    res.render("index.ejs", { content:  convertedAmount + " "+ currencyInputTwo, currency1: amountInput.toLocaleString("en-US")+".00 " + currencyInputOne + "s =", 
    content3: response.data.conversion_rates[currencySplitOne[0]] + ".00 " + currencySplitOne[0] + " = " + response.data.conversion_rates[currencySplitTwo[0]] + " " + currencySplitTwo[0], 
    header: currencyInputOne + " to " + currencyInputTwo });
  } catch (error) {
    res.render("index.ejs", { content: error.response.data });
  }
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
  
