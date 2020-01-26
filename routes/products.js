const express=require('express');
const router=express.Router();
const  db = require('../dbconfig/db');
const path=require('path');
const multer=require('multer');

// to get all products
router.get('/post/',function (req,res) {
    res.render('post');
});
const storage=multer.diskStorage({destination: function (req,file,callback) {
        callback(null,'public/');
    },
    filename:function(req,file,callback){
        callback(null,file.fieldname + '_' + Date.now()+ path.extname(file.originalname));
    }

});
// to upload a single of image
var upload=multer({storage:storage});

router.post('/post/',upload.single('productImg'),function (req,res) {
    var name=req.body.name;
    var price=req.body.price;
    var description=req.body.description;
    var type=req.body.type;
    var seller=req.body.seller;
    var image=req.file['filename'];

    // var sql="INSERT INTO `products`(`id`, `name`, `price`, `type`, `image`, `description`, `seller`) VALUES (NULL,'"+name+"','"+price+"','"+type+"','"+image+"','"+description+"','"+seller+"'";
    var sql="INSERT INTO `products`(`id`, `name`, `price`, `type`, `image`, `description`, `seller`) VALUES (NULL,'"+name+"','"+price+"','"+type+"','"+image+"','"+description+"','"+seller+"')";

    db.query(sql,function (err,result) {
        if(err)
            throw err;
        else {
            res.render('index')

        }

    });




});


router.get('/',function (req,res) {
    // sql to get all products
    var sql = "SELECT * FROM `products`";
    db.query(sql,function (err,products_available) {
        if(err)
            throw err;
        var context={
            products: products_available

        };
        res.render('products',{ products:products_available});
    });
});






// to get a single product
router.get('/:id',function (req,res) {
    var products_id=req.params.id;

    // sql select id
    var sql="SELECT `id`, `name`, `price`, `type`, `image`, `description`, `seller` FROM `products` WHERE id='"+products_id+"'";
    db.query(sql,function (err,found_product) {
        if(err)
            throw err;
        var context={
            products:found_product[0]
        };
        res.render('post',context)
    });


});

// to update
router.put('/:id',function (req,res) {
    var products_id=req.params.id;


    // set new data
    var  name=req.body.name;
    var price=req.body.price;
    var  type=req.body.type;
    var  image=req.body.image;
    var  description=req.body.description;
    var  seller =req.body.seller;

    var sql="UPDATE `products` SET `id`=NULL,`name`='"+name+"',`price`='"+price+"',`type`='"+type+"',`image`='"+image+"',`description`='"+description+"',`seller`='"+seller+"' " +
        "WHERE id='"+products_id+"'";
    db.query(sql,function (err,updated) {
        if(err)
            throw err;
        else{
            res.send(updated);
        }

    });


});

// to delete a product
router.delete('/:id',function (req,res) {
var products_id=req.params.id;



    var sql="DELETE FROM `products` WHERE id='"+products_id+"'";
    db.query(sql,function (err,deleted) {
        if (err)
            throw err;
        else{
            res.send('deleted')
        }

    })
});


























module.exports=router;