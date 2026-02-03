const mongoose =require("mongoose");
const Schema= mongoose.Schema;

const listingSchema = new Schema({
    title: {
          type:String,
          required: true,
    },
    description:String,
    image:{
      filename:{
        type:String,
        default:  "listingimage",
      },
        url:{
        type: String,
        default:
         "https://media.istockphoto.com/id/2153741067/photo/boardwalk-into-tropical-paradise-island.webp?a=1&b=1&s=612x612&w=0&k=20&c=8xqrSdJmY1kEimRbPap_l6z9b_OrISfPV7aKf0d6gHI=ink"
        },  
    },
    price:Number,
    location:String,
    country:String,
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;
