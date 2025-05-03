import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product.js"

// Add Product : /api/product/add
export const addProduct = async (req, res)=>{
    try {
        let productData = JSON.parse(req.body.productData)

        const images = req.files

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        await Product.create({...productData, image: imagesUrl})

        res.json({success: true, message: "Product Added"})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get Product : /api/product/list
export const productList = async (req, res)=>{
    try {
        const products = await Product.find({})
        res.json({success: true, products})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Get single Product : /api/product/id
export const productById = async (req, res)=>{
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        res.json({success: true, product})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res)=>{
    try {
        const { id, inStock } = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.json({success: true, message: "Stock Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// Delete Product : /api/product/delete
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body; // The ID of the product to delete

        // Find the product by ID and delete it
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Optionally, delete the product's images from Cloudinary if you want to clean up.
        // This part is optional and can be done if the product has associated images
        // if (deletedProduct.image && deletedProduct.image.length > 0) {
        //     await Promise.all(
        //         deletedProduct.image.map(async (imageUrl) => {
        //             const imageName = imageUrl.split('/').pop().split('.')[0];
        //             await cloudinary.uploader.destroy(imageName);
        //         })
        //     );
        // }

        res.json({ success: true, message: "Product Deleted" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Rate Product : /api/product/rate
export const rateProduct = async (req, res) => {
    try {
        const { productId, rating } = req.body; // Getting productId and rating from request
        const { userId } = req.body; // Getting userId from the auth middleware

        if (!productId || !rating) {
            return res.json({ success: false, message: "Product ID and Rating are required" });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Check if user has already rated this product
        const userRatingIndex = product.ratings.findIndex(rating => rating.user === userId);

        if (userRatingIndex !== -1) {
            // If the user already rated, update the rating
            product.ratings[userRatingIndex].rating = rating;
        } else {
            // Otherwise, add a new rating for this product
            product.ratings.push({ user: userId, rating });
        }

        await product.save();

        res.json({ success: true, message: "Product rated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};