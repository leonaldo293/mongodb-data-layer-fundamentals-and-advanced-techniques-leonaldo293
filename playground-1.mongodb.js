// ✅ Task 3: Advanced Queries
use("plp_bookstore");

// 🟢 1. Find books that are in stock AND published after 2010
db.books.find({
    in_stock: true,
    published_year: { $gt: 2010 }
});

// 🟢 2. Use projection to return only title, author, and price
db.books.find({}, // todos os documentos
    { title: 1, author: 1, price: 1, _id: 0 } // projeção (oculta _id)
);

// 🟢 3. Sort books by price
// Ascending (do mais barato ao mais caro)
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: 1 });

// Descending (do mais caro ao mais barato)
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: -1 });

// 🟢 4. Pagination: mostrar 5 livros por página
// Página 1 (primeiros 5 livros)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
    .sort({ title: 1 })
    .limit(5)
    .skip(0);

// Página 2 (próximos 5 livros)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
    .sort({ title: 1 })
    .limit(5)
    .skip(5);
// ✅ Task 4: Aggregation Pipeline
use("plp_bookstore");

//
// 🧮 1. Average price of books by genre
//
db.books.aggregate([{
        $group: {
            _id: "$genre", // agrupa por gênero
            averagePrice: { $avg: "$price" },
            totalBooks: { $sum: 1 }
        }
    },
    { $sort: { averagePrice: -1 } } // ordena do mais caro ao mais barato
]);

//
// 🧑‍💻 2. Author with the most books
//
db.books.aggregate([{
        $group: {
            _id: "$author",
            totalBooks: { $sum: 1 }
        }
    },
    { $sort: { totalBooks: -1 } },
    { $limit: 1 } // mostra apenas o autor com mais livros
]);

//
// 📅 3. Group books by publication decade and count them
//
db.books.aggregate([{
        $addFields: {
            decade: {
                $concat: [
                    { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
                    "s"
                ]
            }
        }
    },
    {
        $group: {
            _id: "$decade",
            count: { $sum: 1 }
        }
    },
    { $sort: { _id: 1 } }
]);
// ✅ Task 5: Indexing
use("plp_bookstore");

//
// 🧱 1. Create an index on the "title" field
//
db.books.createIndex({ title: 1 });

//
// 🔢 2. Create a compound index on "author" and "published_year"
//
db.books.createIndex({ author: 1, published_year: -1 });

//
// 🧠 3. Use explain() to check performance improvement
//
// - A query without an index would scan the whole collection
// - After creating indexes, the explain() output will show "IXSCAN" instead of "COLLSCAN"

db.books.find({ title: "1984" }).explain("executionStats");

//
// Test with compound index (author + year)
//
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");