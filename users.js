var express = require('express');
var axios = require('axios');
const moment = require('moment');
const bodyParser = require('body-parser')

const app = express().use(bodyParser.json())
const port = process.env.PORT || 3000

app.get('/hello', function (req, res, next) {
    console.log('hello world');
    res.send('test123')
});

app.post('/TEST', function (req, res, next) {
    console.log('hello')
    
    let orderid = req.body.queryResult.parameters.orderid;
    let intent = req.body.queryResult.intent.displayName;

    if (orderid === '31313') {
        console.log('Order ID:', orderid);

        axios
            .post('https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus', {
                orderId: orderid
            })
            .then(function (response) {
                let shipmentDate = response.data.shipmentDate;
                let formattedDate = moment(shipmentDate).format('dddd, DD MMM YYYY');
                console.log(formattedDate);

                let responseJson = {
                    fulfillmentMessages: [
                        {
                            text: {
                                text: [`Your order with ID ${orderid} will be shipped on ${formattedDate}`]
                            }
                        }
                    ]
                };

                res.send(responseJson);
            })
            .catch(function (error) {
                console.log(error);

                let responseJson = {
                    fulfillmentMessages: [
                        {
                            text: {
                                text: ['Sorry, there was an error retrieving the shipment date']
                            }
                        }
                    ]
                };

                res.send(responseJson);
            });
    } else {

        let responseJson = {
            fulfillmentMessages: [
                {
                    text: {
                        text: ['Invalid order ID. Please try again.']
                    }
                }
            ]
        };

        res.send(responseJson);
    }
});
app.listen(port, () => {
    console.log('server is listening on port:', port)
})
