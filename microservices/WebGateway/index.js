const express = require('express');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load proto files
const userProtoPath = '../UserService/src/main/proto/user.proto';
const orderProtoPath = '../OrderService/src/main/proto/order.proto';
const offerProtoPath = '../OfferService/src/main/proto/offer.proto';

// Create gRPC clients with mock implementations for now
const mockUserClient = {
  GetUsers: (request, callback) => {
    callback(null, { users: [] });
  },
  CreateUser: (request, callback) => {
    callback(null, { id: 1, name: request.name, email: request.email });
  }
};

const mockOrderClient = {
  GetOrders: (request, callback) => {
    callback(null, { orders: [] });
  },
  CreateOrder: (request, callback) => {
    callback(null, { id: 1, user_id: request.user_id, items: request.items });
  }
};

const mockOfferClient = {
  GetOffers: (request, callback) => {
    callback(null, { offers: [] });
  },
  CreateOffer: (request, callback) => {
    callback(null, { id: 1, title: request.title, description: request.description, price: request.price });
  }
};

// Helper function to promisify gRPC calls
function promisifyGrpcCall(client, methodName) {
  return (request) => {
    return new Promise((resolve, reject) => {
      client[methodName](request, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  };
}

// User endpoints
app.get('/api/users', async (req, res) => {
  try {
    const getUsers = promisifyGrpcCall(mockUserClient, 'GetUsers');
    const response = await getUsers({});
    res.json(response.users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const createUser = promisifyGrpcCall(mockUserClient, 'CreateUser');
    const response = await createUser(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const getOrders = promisifyGrpcCall(mockOrderClient, 'GetOrders');
    const response = await getOrders({});
    res.json(response.orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const createOrder = promisifyGrpcCall(mockOrderClient, 'CreateOrder');
    const response = await createOrder(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Offer endpoints
app.get('/api/offers', async (req, res) => {
  try {
    const getOffers = promisifyGrpcCall(mockOfferClient, 'GetOffers');
    const response = await getOffers({});
    res.json(response.offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/offers', async (req, res) => {
  try {
    const createOffer = promisifyGrpcCall(mockOfferClient, 'CreateOffer');
    const response = await createOffer(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Web Gateway running on port ${port}`);
}); 