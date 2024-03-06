const { Client } = require("pg");

const connectDatabase = () => {
	const client = new Client({
		user: "postgres",
		host: "192.168.1.93",
		database: "Training",
		password: "mawai123",
		port: 5432,
	});

	client
		.connect()
		.then(() => console.log("Connected to PostgreSQL database"))
		.catch((err) => console.error("Connection error", err.stack));
};

module.exports = connectDatabase;
