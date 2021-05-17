const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: 'qfd7dwnr9khktxc7',
    publicKey: 'mpyp6yp4s9q4nz6k',
    privateKey: '3c9f065d2ea277c0522e182048681b9a'
});


exports.getToken = (req, res) => {
    gateway.clientToken.generate({
        // customerId: aCustomerId
    }, (err, response) => {
        // pass clientToken to your front-end
        if (err) {
            res.status(500).json({
                error: "Token Generation failed"
            })
        } else {
            res.send(response)
        }
        // const clientToken = response.clientToken
    });
}


exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.payment.paymentMethodNonce
    let amount = req.body.payment.amount
    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient,
        // deviceData: deviceDataFromTheClient,
        options: {
            submitForSettlement: true
        }
    }, (err, result) => {
        if (err) {
            res.status(500).json({
                error: "Payment Process failed"
            })
        } else {
            res.send(result)
        }
    });
}