import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const MyOrders = () => {

    const [myOrders, setMyOrders] = useState([])
    const {currency, axios, user} = useAppContext()

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user')
            if (data.success) {
                setMyOrders(data.orders)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const cancelOrder = async (orderId) => {
        try {
            const { data } = await axios.post('/api/order/cancel', { orderId })
            if (data.success) {
                // Remove the cancelled order from the list
                setMyOrders(myOrders.filter(order => order._id !== orderId))
                alert('Order cancelled successfully!')
            } else {
                alert('Unable to cancel order!')
            }
        } catch (error) {
            console.log(error);
            alert('Something went wrong, please try again.')
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyOrders()
        }
    }, [user])

    const isOrderCancelable = (orderDate) => {
        const currentTime = new Date();
        const orderTime = new Date(orderDate);
        const timeDifference = (currentTime - orderTime) / 1000 / 60; // Time in minutes
        return timeDifference <= 30; // Allow cancellation within 30 minutes
    }

    return (
        <div className='mt-16 pb-16'>
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>My orders</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>
            {myOrders.map((order, index) => (
                <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
                    <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                        <span>OrderId : {order._id}</span>
                        <span>Payment : {order.paymentType}</span>
                        <span>Total Amount : {currency}{order.amount}</span>
                    </p>
                    {order.items.map((item, index) => (
                        <div key={index} className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"} border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>
                            <div className='flex items-center mb-4 md:mb-0'>
                                <div className='bg-primary/10 p-4 rounded-lg'>
                                    <img src={item.product.image[0]} alt="" className='w-16 h-16' />
                                </div>
                                <div className='ml-4'>
                                    <h2 className='text-xl font-medium text-gray-800'>{item.product.name}</h2>
                                    <p>Category: {item.product.category}</p>
                                </div>
                            </div>

                            <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                                <p>Quantity: {item.quantity || "1"}</p>
                                <p>Status: {order.status}</p>
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            
                            <div className='flex items-center justify-between w-full md:w-auto'>
                                <p className='text-primary text-lg font-medium'>
                                    Amount: {currency}{item.product.offerPrice * item.quantity}
                                </p>
                                {/* Show Cancel button only if order is within 30 minutes of placement */}
                                {isOrderCancelable(order.createdAt) && (
                                    <button
                                        onClick={() => cancelOrder(order._id)}
                                        className="ml-4 bg-red-500 text-white py-2 px-4 rounded-lg"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default MyOrders
