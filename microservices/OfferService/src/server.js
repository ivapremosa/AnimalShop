const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');

// Load proto file
const PROTO_PATH = __dirname + '/protos/offer.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const offerProto = grpc.loadPackageDefinition(packageDefinition).offer;

// Connect to MongoDB using MongoDB Compass default connection
mongoose.connect('mongodb://localhost:27017/offerservice', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define Offer schema
const offerSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Offer = mongoose.model('Offer', offerSchema);

// Implement gRPC service methods
const server = new grpc.Server();

server.addService(offerProto.OfferService.service, {
  GetAllOffers: async (call, callback) => {
    console.log('GetAllOffers called');
    try {
      const offers = await Offer.find({});
      console.log('Found offers:', offers);
      callback(null, { offers: offers.map(offer => ({
        id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        createdAt: offer.createdAt.toISOString(),
        updatedAt: offer.updatedAt.toISOString()
      }))});
    } catch (error) {
      console.error('Error in GetAllOffers:', error);
      callback(error);
    }
  },

  GetOfferById: async (call, callback) => {
    console.log('GetOfferById called with id:', call.request.id);
    try {
      const offer = await Offer.findById(call.request.id);
      if (!offer) {
        console.log('Offer not found');
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'Offer not found'
        });
        return;
      }
      callback(null, {
        id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        createdAt: offer.createdAt.toISOString(),
        updatedAt: offer.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Error in GetOfferById:', error);
      callback(error);
    }
  },

  CreateOffer: async (call, callback) => {
    console.log('CreateOffer called with:', call.request);
    try {
      const offer = new Offer({
        title: call.request.title,
        description: call.request.description,
        price: call.request.price
      });
      await offer.save();
      console.log('Created offer:', offer);
      callback(null, {
        id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        createdAt: offer.createdAt.toISOString(),
        updatedAt: offer.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Error in CreateOffer:', error);
      callback(error);
    }
  },

  UpdateOffer: async (call, callback) => {
    console.log('UpdateOffer called with:', call.request);
    try {
      const offer = await Offer.findByIdAndUpdate(
        call.request.id,
        {
          title: call.request.title,
          description: call.request.description,
          price: call.request.price,
          updatedAt: new Date()
        },
        { new: true }
      );
      if (!offer) {
        console.log('Offer not found for update');
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'Offer not found'
        });
        return;
      }
      console.log('Updated offer:', offer);
      callback(null, {
        id: offer._id,
        title: offer.title,
        description: offer.description,
        price: offer.price,
        createdAt: offer.createdAt.toISOString(),
        updatedAt: offer.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Error in UpdateOffer:', error);
      callback(error);
    }
  },

  DeleteOffer: async (call, callback) => {
    console.log('DeleteOffer called with id:', call.request.id);
    try {
      const result = await Offer.findByIdAndDelete(call.request.id);
      if (!result) {
        console.log('Offer not found for deletion');
        callback({
          code: grpc.status.NOT_FOUND,
          details: 'Offer not found'
        });
        return;
      }
      console.log('Deleted offer:', result);
      callback(null, {});
    } catch (error) {
      console.error('Error in DeleteOffer:', error);
      callback(error);
    }
  }
});

// Start server
server.bindAsync(
  '0.0.0.0:3003',
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
    console.log(`Offer Service running on port ${port}`);
    server.start();
  }
); 