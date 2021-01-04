const cors = require("cors")
const express = require("express")
// TODO add stripe key
const stripe = require("stripe")("sk_test_51I5ZBCAdfLcrQvKKjOQhea0FvpMI6qGWpo8ZNbwTtskPU6vAoh7841mHhSXa3ZsLzZmdWQ1SwtNNE7HYyXjGEfRs00DHVT0S3E");
const uuid = require("uuid");


const app = express();


// middleware
app.use(express.json())
app.use(cors())


//routes
app.get("/", (req, res) => {
    res.send("IT WORKS ");
});

app.post("/payment", (req, res) => {

    const {product, token} = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    const idempontencyKey = uuid()

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
       stripe.charges.create({
           amount: product.price * 500,
           currency: 'USD',
           customer: customer.id,
           receipt_email: token.email,
           description: `purchase of product.name`,
           shipping: {
               name: token.card.name,
               address: {
                   country: token.card.address_country
               }
           }
       }, {idempontencyKey}) 
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err) )
})


//listen

app.listen(4000, () => console.log("LISTENING AT PORT 4000"))