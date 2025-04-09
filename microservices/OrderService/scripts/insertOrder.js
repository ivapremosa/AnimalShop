const { MongoClient } = require('mongodb');

async function insertOrder() {
    const uri = "mongodb+srv://admin:admin@ita.vittz13.mongodb.net/ITA1?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
        ssl: true,
        tls: true,
        tlsAllowInvalidCertificates: true
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('ITA1');
        const orders = database.collection('orders');

        const order = {
            customerName: "Animal Shop Test Order",
            customerEmail: "test@animalshop.com",
            shippingAddress: "123 Pet Street, Zoo City",
            totalAmount: 299.99,
            status: "PENDING",
            orderDate: new Date(),
            lastUpdated: new Date()
        };

        const result = await orders.insertOne(order);
        console.log(`Successfully inserted order with id: ${result.insertedId}`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

insertOrder(); 