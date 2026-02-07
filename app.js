const express = require("express");
const app =express();
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path=require("path");
const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
app.use(methodOverride("_method"));
main()
.then(() =>{
    console.log("connected to DB")
})
.catch((err) =>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.get("/",(req,res)=>{
res.send("Hi,I am root");
});
//index Route
app.get("/listings",async(req,res)=>{
   const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
});
//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
});
//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
//create Route
app.post("/listings",async(req,res)=>{
 
 const newListing=new Listing(req.body.listing);
 await newListing.save();
 res.redirect("/listings");
});
//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(
    id,
    { $set: req.body.listing },   // ✅ THIS IS THE FIX
    { new: true }
  );

  res.redirect(`/listings/${id}`);
});

//DELETE ROUTE
app.delete("/listings/:id",async(req,res)=>{
    let {id} =req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});
// app.get("/testListing", async (req,res) =>{
//     let sampleListing= new Listing ({
//         title: "My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });

 
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
// });

// pages
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/slot", (req, res) => {
  res.render("Slot");
});

app.get("/book", (req, res) => {
  res.render("Book");
});
app.get("/booked-slots", (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.json([]);
  }

  const sql = "SELECT slot FROM bookings WHERE booking_date = ?";

  db.query(sql, [date], (err, results) => {
    if (err) {
      console.error(err);
      return res.json([]);
    }

    const bookedSlots = results.map(row => row.slot);
    res.json(bookedSlots);
  });
});


// booking API
// booking API
app.post("/book", (req, res) => {
  const { date, slot, name, email, phone, gender } = req.body;

  console.log("BODY:", req.body);

  if (!date || !slot || !name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const sql =
    "INSERT INTO bookings (booking_date, slot, name, email, phone, gender) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [date, slot, name, email, phone, gender], (err) => {
    if (err) {
      console.error(err);
      return res.json({
        success: false,
        message: "Already booked or error occurred",
      });
    }

    res.json({ success: true });
  });
});

app.get("/view-slots", (req, res) => {
  const sql = "SELECT * FROM bookings ORDER BY booking_date DESC, slot ASC";
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render("BookedSlots", { bookings: results });
  });
});

app.get("/about", (req, res) => {
  res.render("About");
});

// server
app.listen(8080, () => {
  console.log("Server is running");
});
