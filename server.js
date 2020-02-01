const express =  require('express');
const session = require('express-session');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Path = require('path');


const app = express();
const userRoutes= require('./routes/users');
const productRoutes= require('./routes/products');



/// configer hbs view engine/template
app.set("view engine",'hbs');
app.engine(
    'hbs',
    hbs(
        {
            layoutDir:__dirname + './views/layouts',
            // nw configuration parameter
            extname:'hbs'


        }));
app.use(express.static(__dirname + 'public/'));

app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true,
    cookie:{
     maxAge:1000 * 60 * 60 *2
    }

}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/',function (req,res) {
    res.render('index')
});

app.use('/users',userRoutes);
app.use('/products',productRoutes);


const port =3004;
app.listen(port,function () {
    console.log(`localhost:${port}`)

});
