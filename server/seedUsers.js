import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const users = [
  { name: "Ajay Gouda", department: "Vegetables", location: "BBSR-ho" },
  { name: "Anusaya Naik", department: "Cfcv", location: "BBSR-ho" },
  { name: "Apsari Dakua", department: "Vegetables", location: "BBSR-ho" },
  { name: "Bikash Behera", department: "Vegetables", location: "Wh-Jatani" },
  { name: "Bikash Kissan", department: "Vegetables", location: "BBSR-ho" },
  { name: "Bikash Sahoo", department: "Cfcv", location: "BBSR-ho" },
  { name: "Chittaranjan Bularsingh", department: "Procurement", location: "BBSR-ho" },
  { name: "D Jitendra Dora", department: "Cfcv", location: "BBSR-ho" },
  { name: "Duryodhan Rout", department: "Wh-manager", location: "Wh-Jatani" },
  { name: "Ganesh Gouda", department: "Vegetables", location: "BBSR-ho" },
  { name: "Golekha Ojha", department: "Cfcv", location: "BBSR-ho" },
  { name: "Golekha Sahoo", department: "Vegetables", location: "BBSR-ho" },
  { name: "Ishant Kumar Pradhan", department: "Vegetables", location: "BBSR-ho" },
  { name: "Jagannath Luhura", department: "Vegetables", location: "BBSR-ho" },
  { name: "Jasaswini Mohini", department: "Data And Labelling", location: "BBSR-ho" },
  { name: "Jayanti Pradhan", department: "Leafy", location: "BBSR-ho" },
  { name: "J Siba Dora", department: "Vegetables", location: "BBSR-ho" },
  { name: "Kanak Swain", department: "Cook", location: "BBSR-ho" },
  { name: "Kuni Gouda", department: "Leafy", location: "BBSR-ho" },
  { name: "Lavanya Swain", department: "Cfcv", location: "BBSR-ho" },
  { name: "Lipuna Nayak", department: "Cfcv", location: "BBSR-ho" },
  { name: "Lipuni Pradhan", department: "Vegetables", location: "Wh-Jatani" },
  { name: "Mamata Sethi", department: "Leafy", location: "BBSR-ho" },
  { name: "Mansi Subudhi", department: "Vegetables", location: "BBSR-ho" },
  { name: "Pradeep Kumar Sahoo", department: "Vegetables", location: "BBSR-ho" },
  { name: "Prayosrata Behera", department: "Driver", location: "BBSR-ho" },
  { name: "Rashmi Ranjan Bhoi", department: "Cfcv", location: "BBSR-ho" },
  { name: "Rituraj Pradhan", department: "Vegetables", location: "BBSR-ho" },
  { name: "Rudra Prasant Rout", department: "Vegetables", location: "BBSR-ho" },
  { name: "Sabita Dakua", department: "Cook", location: "BBSR-ho" },
  { name: "Sanjiara Samal", department: "Leafy", location: "BBSR-ho" },
  { name: "Santilata Lenka", department: "Vegetables", location: "BBSR-ho" },
  { name: "Sangash Acheri", department: "Vegetables", location: "Wh-Jatani" },
  { name: "Satyabanu Sethi", department: "Driver", location: "Wh-Jatani" },
  { name: "Shivajit Behera", department: "Cfcv", location: "BBSR-ho" },
  { name: "Sibaram Sahoo", department: "Vegetables", location: "Wh-Jatani" },
  { name: "Sibosunti Behera", department: "Leafy", location: "BBSR-ho" },
  { name: "Subha Krishna Behera", department: "Wh-manager", location: "Wh-Jatani" },
  { name: "Subham Dakua", department: "Vegetables", location: "BBSR-ho" },
  { name: "Subham Kumar Sethi", department: "Vegetables", location: "BBSR-ho" },
  { name: "Subhashini Jena", department: "Vegetables", location: "BBSR-ho" },
  { name: "Sudarshaana Moharasa", department: "Vegetables", location: "BBSR-ho" },
  { name: "Suman Dagupta", department: "Vegetables", location: "Wh-Jatani" },
  { name: "Sunil Kumar Sahoo", department: "Vegetables", location: "Wh-Jatani" },
  { name: "Sushant Dehari", department: "Driver", location: "BBSR-ho" },
  { name: "Swapna Rout", department: "Vegetables", location: "BBSR-ho" },
  { name: "Tapan Kumar Jana", department: "Procurement", location: "Wh-Jatani" },
  { name: "T Benubola Dora", department: "Cfcv", location: "BBSR-ho" },
  { name: "Tukuna Behera", department: "Vegetables", location: "Wh-Jatani" },
  { name: "Umesh Mohanty", department: "Vegetables", location: "BBSR-ho" },
  { name: "Urmila Mohini", department: "Vegetables", location: "BBSR-ho" },
  { name: "Dr. Ramesh Chandra Biswal", department: "CEO", location: "BBSR-ho" },
  { name: "Ajit Bag", department: "CMO", location: "BBSR-ho" },
  { name: "Ananya Parida", department: "Executive, Admin & Projects", location: "BBSR-ho" },
  { name: "Suresh Khuntia", department: "Manager, DC", location: "BBSR-ho" },
  { name: "Harishankar Pal", department: "Manager, Farmers' Success", location: "BBSR-ho" },
  { name: "Sameeksh Pradhan", department: "Accountant", location: "BBSR-ho" },
  { name: "Dr Dilip Krishna", department: "Director & R n D Head", location: "BBSR-ho" },
  { name: "Nibedita Mohanty", department: "CEO", location: "BBSR-ho" },
  { name: "Swatagama Panigrahi", department: "CFO", location: "BBSR-ho" },
  { name: "Rakesh Kr Panda", department: "CTO", location: "BBSR-ho" },
  { name: "Trilochana Behera", department: "Manager, Logistics", location: "BBSR-ho" },
  { name: "Saiya Nurayan Behera", department: "Manager, Retail Fulfillment", location: "BBSR-ho" },
  { name: "Sangita Behura", department: "Manager, People, Project & Partnership", location: "BBSR-ho" },
  { name: "Kamal Kumar Mohanty", department: "Manager, Farmers' Success", location: "BBSR-ho" },
  { name: "Saroj Ranjan Sahoo", department: "Manager Sales & Outlet OPT", location: "BBSR-ho" },
  { name: "Bimadisha Behera", department: "Manager, Trainer", location: "BBSR-ho" },
  { name: "Suryakanta Parida", department: "Supervisor", location: "BBSR-ho" }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - remove this if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('🗑️  Cleared existing users');

    // Insert users
    const result = await User.insertMany(users, { ordered: false });
    console.log(`✅ Successfully added ${result.length} users to the database`);

    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️  Some users already exist (duplicate names), skipping them');
      console.log(`✅ Added new users successfully`);
    } else {
      console.error('❌ Error seeding users:', error.message);
    }
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedUsers();
