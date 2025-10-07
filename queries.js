import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("❌ MONGODB_URI não definida. Adicione-a no ficheiro .env");

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db("plp_bookstore");
        const books = db.collection("books");

        // === Basic CRUD ===
        console.log("Books in Fantasy genre:");
        console.log(await books.find({ genre: "Fantasy" }).toArray());

        console.log("Books published after 2000:");
        console.log(await books.find({ published_year: { $gt: 2000 } }).toArray());

        console.log("Books by George Orwell:");
        console.log(await books.find({ author: "George Orwell" }).toArray());

        await books.updateOne({ title: "1984" }, { $set: { price: 11.99 } });
        console.log("✅ Updated price for 1984");

        await books.deleteOne({ title: "Dune" });
        console.log("🗑️ Deleted 'Dune'");

        // === Advanced Queries ===
        console.log("In-stock books after 2010:");
        console.log(await books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray());

        console.log("Projection (title, author, price):");
        console.log(await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray());

        console.log("Sorted by price ASC:");
        console.log(await books.find().sort({ price: 1 }).toArray());

        console.log("Sorted by price DESC:");
        console.log(await books.find().sort({ price: -1 }).toArray());

        console.log("Pagination (5 per page):");
        console.log(await books.find().skip(0).limit(5).toArray());

        // === Aggregations ===
        console.log("Average price by genre:");
        console.log(await books.aggregate([{ $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }]).toArray());

        console.log("Author with most books:");
        console.log(await books.aggregate([
            { $group: { _id: "$author", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]).toArray());

        console.log("Books grouped by decade:");
        console.log(await books.aggregate([{
                $group: {
                    _id: { $floor: { $divide: ["$published_year", 10] } },
                    count: { $sum: 1 }
                }
            },
            { $project: { decade: { $multiply: ["$_id", 10] }, count: 1, _id: 0 } },
            { $sort: { decade: 1 } }
        ]).toArray());

        // === Indexing ===
        await books.createIndex({ title: 1 });
        await books.createIndex({ author: 1, published_year: -1 });

        const explain = await books.find({ title: "1984" }).explain("executionStats");
        console.log("Explain result:", explain.executionStats);
    } catch (err) {
        console.error("Erro:", err);
    } finally {
        await client.close();
    }
}

run();