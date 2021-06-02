/** @format */

const mongoose = require("mongoose");

//
// mongoDB Compass
//
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/doosha";
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    console.log(`Successfully connected to the database ${MONGODB_URI}`)
  )
  .catch((error) => {
    console.error(
      `An error ocurred trying to connect to the database ${MONGODB_URI}: `,
      error
    );
    process.exit(1);
  });



//
// mongoDB Atlas
//
//const MONGODB_URI = process.env.MONGODB_URI;
// mongoose
//   .connect(MONGODB_URI, {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then((x) => {
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
//   })
//   .catch((err) => {
//     console.error("Error connecting to mongo", err);
//   });
