const { Client, Pool } = require("pg");
const natural = require("natural");

// const client = new Client({
// 	user: "postgres",
// 	host: "192.168.1.93",
// 	database: "Training",
// 	password: "mawai123",
// 	port: 5432,
// });

const dbConfig = {
	user: "postgres",
	host: "192.168.1.93",
	database: "Training",
	password: "mawai123",
	port: 5432,
};

// client
// 	.connect()
// 	.then(() => console.log("Connected to PostgreSQL database"))
// 	.catch((err) => console.error("Connection error", err.stack));

const classifier = new natural.BayesClassifier();
classifier.addDocument("Show sales data for product X", "sales_data");
classifier.addDocument(
	"What is the current inventory of product Y?",
	"inventory_status",
);
classifier.train();

// Function to process user query
async function processUserQuery(userQuery) {
	try {
		// Use NLP library to extract intent
		const intent = classifier.classify(userQuery);
		console.log(intent);

		// Generate SQL query based on intent
		const sqlQuery = generateSQLQuery(intent);
		console.log(sqlQuery);

		// Connect to the database
		const pool = new Pool(dbConfig);
		const client = await pool.connect();

		// Execute SQL query
		const result = await client.query(sqlQuery);

		// Release the connection and return result
		await client.release();
		return result.rows;
	} catch (error) {
		console.error("Error processing user query:", error);
		throw error;
	}
}

function generateSQLQuery(intent) {
	switch (intent) {
		case "sales_data":
			return `SELECT * FROM "TRAINING".dept`;
		case "inventory_status":
			return "SELECT * FROM inventory WHERE product_id = $1";
		default:
			throw new Error("Unsupported intent");
	}
}

// Example usage
const userQuery = "current inventory sale status";
processUserQuery(userQuery)
	.then((result) => console.log("Query result:", result))
	.catch((error) => console.error("Error processing query:", error));

// client
// 	.query(`SELECT * FROM "TRAINING".dept`)
// 	.then((res) => {
// 		console.log(res.rows);
// 	})
// 	.catch((err) => {
// 		console.error("Error executing query", err.stack);
// 	});

// client
// 	.end()
// 	.then(() => console.log("Disconnected from PostgreSQL database"))
// 	.catch((err) => console.error("Error closing connection", err.stack));
