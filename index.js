const express = require('express');
const exphbs  = require('express-handlebars');

pg = require('pg');
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL  || 'postgresql://codex-coder:pg123@localhost:5432/avodb'

const pool = new Pool({
    connectionString,rejectUnauthorized:false
});

const app = express();
const PORT =  process.env.PORT || 3019;

const AvShop = require("./avo-shopper")

let avShop = AvShop(pool)




// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

let counter = 0;

app.get('/', async function(req, res) {
	let bstDeals = await avShop.topFiveDeals()
	
	res.render('index', {
		bstDeals
	});
});

app.get("/allShops", async (req,res)=>{
	let shops = await avShop.listShops()
	res.render("allShops",{shops})
});


app.get("/bestShopDeal",async (req,res)=>{
	let shops = await avShop.listShops()
	res.render('bestShopDeal',{shops});

});

app.post("/bestShopDeal",async (req,res)=>{
	console.log(req.body.sell)

	let shopDeals = await avShop.dealsForShop(Number(req.body.sell));
	console.log({shopDeals})	

	res.render('bestShopDeal')
});

app.post("/add",async (req,res)=>{
	req.body
	console.log(req.body.inName)
	res.redirect('/add');
});

app.get("/add",async (req,res)=>{

	res.render('add',{});

});

app.post("/newShop", async (req,res)=>{
	avShop.createShop(req.body.newShopName);

	console.log(req.body.newShopName);
	res.render('newShop',{})

});

app.get("/newShop",async (req,res)=>{
	// console.log();
	res.render('newShop');

});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});