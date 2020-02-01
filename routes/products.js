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
            res.redirect('/products')

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



//
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
        res.render('/products',context)
    });


});

// to delete
router.get('/delete/:id',function (req,res) {

//
    var products_id=req.params.id;

    var sql="DELETE FROM `products` WHERE id='"+products_id+"'";
    db.query(sql,function (err,deleted) {
        if (err)
            throw err;
        else{
            res.redirect('/products')
        }

    })
});






// router.get('/product/update:id',function (req,res) {
//
// var products_id=req.params.id;
    // sql select id
//     var sql="SELECT `id`, `name`, `price`, `type`, `image`, `description`, `seller` FROM `products` WHERE id='"+products_id+"'";
//     db.query(sql,function (err,found_product) {
//         if(err)
//             throw err;
//         /**
//          * Take all the columns returned and populate in the hbs fields
//          *  var  name=found_product[0].name;
//          var price=req.found_product[0].price;
//          var  type=req.found_product[0].type;
//          var  image=req.found_product[0].image;
//          var  description=found_product[0].description;
//          var  seller =found_product[0].seller;
//          */
//         //res.render('post',{username:seller}...............all the fields)
//
//
//     })
// });

// to update
router.get('/update/:id',function (req,res) {
    var products_id = req.params.id;

    //
    // // set new data
    // var  name=req.body.name;
    // var price=req.body.price;
    // var  type=req.body.type;
    // var  image=req.body.image;
    // var  description=req.body.description;
    // var  seller =req.body.seller;
    //

    var sql = "SELECT `id`, `name`, `price`, `type`, `image`, `description`, `seller` FROM `products` WHERE id='" + products_id + "'";
    db.query(sql, function (err, found_product) {
        if (err)
            throw err;
        var context = {
            products: found_product[0]
        };
        console.log(found_product[0])
        return res.render('update', found_product[0]);
    });

});
router.post('/update',upload.single('productImg'),function(req,res){
    const products_id = req.body.productId;
    const name = req.body.user_name;
    const type = req.body.type;
    const price = req.body.price;
    const description = req.body.description;
    const sellerName = req.body.sellerName;
    var sql = "UPDATE `products` SET `id`='" + products_id +
        "',`name`='" + name + "',`price`='" + price + "',`type`='"
        + type + "',`description`='" + description + "',`seller`='" + sellerName + "' " +
        "WHERE id='" + products_id + "'";  // sql select id

    db.query(sql, function (err, updated) {
        if (err)
            throw err;
        else {
          if(!req.file&&updated)
          return  res.redirect('/products');
          else{
              let productImage = req.file;
              if(productImage){
                  productImage=productImage['filename'];
                  const sql2="UPDATE `products` SET `image`='" + productImage+"'WHERE id='" + products_id + "'";
                  db.query(sql2,function(err,updated){
                      if(err){
                          throw err;
                      }
                      else{
                          res.redirect('/products');
                      }
                  })
              }
          }
        }

    })
})









module.exports=router;