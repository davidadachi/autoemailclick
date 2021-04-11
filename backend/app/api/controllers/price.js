const axios = require('axios');
const priceModel = require('../models/price');	

module.exports = {
  getPrice: function(req, res, next) {
    const startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    const current = new Date();
    priceModel.find({ 
      $and: [ { Timestamp: { $gte : startTime } }, { Timestamp: { $lte : current } }] 
    })
    .sort({Timestamp: -1})
    .exec()
    .then((result) => {
      if (result.length === 0)
        res.status(400).json({ msg: "Not found" });
      else {
        const currentPrice = result[0];
        let maxValue = currentPrice.price;
        let minValue = currentPrice.price;
        let maxPrice = result[0];
        let minPrice = result[0];
        for (let item of result) {
          if (item.price > maxValue) {
            maxPrice = item;
            maxValue = item.price;
          }
          if (item.price < minValue) {
            minPrice = item;
            minValue = item.price;
          }
        }
        res.status(200).json({msg: "Found!", data: {current: currentPrice, max: maxPrice, min: minPrice}});
      }
    })
    .catch(error =>  {
      res.status(400).json({ msg: "Not found" });
    })
  },
  create: function() {
    const id = 8757
    axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?'+ new URLSearchParams({
        id: id,
      }),
      {headers: {
        'X-CMC_PRO_API_KEY': 'd2a7a936-e772-45b2-91f1-786577bd0240',
      }},
      )
    .then((result) => {
      let price={};
      price.price=result.data.data[id].quote.USD.price;
      priceModel.create(price, function (err, result) {
        if (err) {
          console.log(err)
        }
        else {
          console.log('success price' + price.price)
        }
      });
    }).catch((err) => {
      console.log('price api error')
    });
    
  },
}					