const axios = require("axios");
const cheerio = require("cheerio");
const express = require('express');
const app = express();


app.set('port',process.env.PORT || 3000)


const cors = require('cors');

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {

      let current_exchange_rate_index=0
      let exchange_rate_codes=['MZN','ZAR','USD','EUR']
      let exchange_rates={}
      for (let i = 0; i < exchange_rate_codes.length; i++) exchange_rates[exchange_rate_codes[i]]=[]


      for (let i = 0; i < exchange_rate_codes.length; i++) {
            let codes=exchange_rate_codes.filter(r=>r!=exchange_rate_codes[i])
            for (let j = 0; j < codes.length; j++) {
              
              getER(`https://www.google.com/search?q=${codes[j]}+to+${exchange_rate_codes[i]}`,exchange_rate_codes[i],codes[j])
              
            }
      }

      function getER(url,code,returned_rate){
          axios.get(url).then(response => {
              const $ = cheerio.load(response.data);
              let value=parseFloat($('.BNeawe:eq(1)').text().replace(/,/g, '.'))
              if(exchange_rates[code].length < exchange_rate_codes.length)    exchange_rates[code].push({code:returned_rate,value})

              if(exchange_rates[code].length==3) {
                   current_exchange_rate_index++
              }

              if(current_exchange_rate_index == exchange_rate_codes.length){
                console.log(exchange_rates)
                res.send({exchange_rates,codes:exchange_rate_codes})
              }

          }).catch(error => {
              
          })
      }

})


app.listen(app.get('port'));