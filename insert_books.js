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

        const docs = [
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", published_year: 1925, price: 10.99, in_stock: true, pages: 218, publisher: "Scribner" },
            { title: "1984", author: "George Orwell", genre: "Dystopian", published_year: 1949, price: 8.99, in_stock: true, pages: 328, publisher: "Secker & Warburg" },
            { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", published_year: 1960, price: 12.0, in_stock: true, pages: 281, publisher: "J.B. Lippincott & Co." },
            { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", published_year: 1937, price: 15.0, in_stock: true, pages: 310, publisher: "George Allen & Unwin" },
            { title: "Harry Potter and the Sorcerer’s Stone", author: "J.K. Rowling", genre: "Fantasy", published_year: 1997, price: 20.0, in_stock: true, pages: 309, publisher: "Bloomsbury" },
            { title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", published_year: 1996, price: 18.5, in_stock: false, pages: 694, publisher: "Bantam Books" },
            { title: "Becoming", author: "Michelle Obama", genre: "Biography", published_year: 2018, price: 25.0, in_stock: true, pages: 448, publisher: "Crown" },
            { title: "Educated", author: "Tara Westover", genre: "Memoir", published_year: 2018, price: 17.0, in_stock: true, pages: 334, publisher: "Random House" },
            { title: "The Silent Patient", author: "Alex Michaelides", genre: "Thriller", published_year: 2019, price: 14.0, in_stock: true, pages: 336, publisher: "Celadon Books" },
            { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", published_year: 1965, price: 19.0, in_stock: true, pages: 412, publisher: "Chilton Books" }
        ];

        const result = await books.insertMany(docs);
        console.log(`✅ ${result.insertedCount} livros inseridos no MongoDB Atlas.`);
    } catch (error) {
        console.error("Erro ao inserir livros:", error);
    } finally {
        await client.close();
    }
}

run();