import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

    return product && (
        <div
            onClick={() => {
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0);
            }}
            className="border border-gray-500/20 rounded-md bg-white min-w-56 max-w-56 w-full p-4 hover:shadow-md transition"
        >
            <div className="group cursor-pointer flex items-center justify-center">
                <img className="group-hover:scale-105 transition max-w-26 md:max-w-36" src={product.image[0]} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm mt-3">
                <p>{product.category}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>

                <div className="flex items-center gap-1 mt-1">
                    {(() => {
                        const ratings = product.ratings || [];
                        const averageRating = ratings.length > 0
                            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                            : 0;
                        const fullStars = Math.round(averageRating);

                        return (
                            <>
                                {Array(5).fill('').map((_, i) => (
                                    <img
                                        key={i}
                                        className="w-4 h-4"
                                        src={i < fullStars ? assets.star_icon : assets.star_dull_icon}
                                        alt=""
                                    />
                                ))}
                                <p className="ml-1 text-xs">({averageRating.toFixed(1)})</p>
                            </>
                        );
                    })()}
                </div>

                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-primary">
                        {currency}{product.offerPrice}{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">{currency}{product.price}</span>
                    </p>
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary">
                        {!cartItems[product._id] ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer"
                                onClick={() => addToCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart_icon" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                                <button onClick={() => { removeFromCart(product._id) }} className="cursor-pointer text-md px-2 h-full">-</button>
                                <span className="w-5 text-center">{cartItems[product._id]}</span>
                                <button onClick={() => { addToCart(product._id) }} className="cursor-pointer text-md px-2 h-full">+</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
