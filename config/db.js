const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
	try {
		await client.connect();
		console.log('Connected successfully to MongoDB');
		return client.db('booksdb');
	} catch(err) {
		console.error('Connection error:', err);
		process.exit(1);
	}
}

module.exports = {
	connectDB
}