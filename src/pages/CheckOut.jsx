import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { MdDeliveryDining } from "react-icons/md";
import 'leaflet/dist/leaflet.css';
import { setAddress, setLocation } from '../redux/map.Slice';
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { serverUrl } from '../App';
import { addMyOrders } from '../redux/userSlice';

// Recenter map when location changes
function RecenterMap({ location }) {
    const map = useMap();
    if (location.lat && location.lon) {
        map.setView([location.lat, location.lon], 16, { animate: true });
    }
    return null;
}

function CheckOut() {
    const { location, address } = useSelector(state => state.map);
    const { cartItems, totalAmount, userData } = useSelector(state => state.user);

    const [addressInput, setAddressInput] = useState("");
    const dispatch = useDispatch();
    const apiKey = import.meta.env.VITE_GEOAPIKEY;
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const deliveryFee = totalAmount > 500 ? 0 : 40;
    const AmountWithDeliveryFee = totalAmount + deliveryFee;

    // get address by lat/lng
    const getAddressBylatlng = async (lat, lng) => {
        try {
            const result = await axios.get(
                `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
            );
            const addr = result?.data?.results[0]?.address_line2;
            dispatch(setAddress(addr));
            setAddressInput(addr || "");
        } catch (error) {
            console.log(error);
        }
    };

    // get lat/lng by address input
    const getLatLngByAddress = async () => {
        try {
            const result = await axios.get(
                `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`
            );
            const { lat, lon } = result.data.features[0].properties;
            dispatch(setLocation({ lat, lon }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (address) setAddressInput(address);
    }, [address]);

    // Draggable marker component
    const DraggableMarker = ({ location }) => {
        const map = useMap();

        const onDragEnd = (e) => {
            const { lat, lng } = e.target.getLatLng();
            dispatch(setLocation({ lat, lon: lng }));
            getAddressBylatlng(lat, lng);
            map.setView([lat, lng], 16, { animate: true });
        };

        return (
            <Marker
                position={[location?.lat, location?.lon]}
                draggable
                eventHandlers={{ dragend: onDragEnd }}
            />
        );
    };

    // get user’s current location
    const getCurrentLocation = () => {
        const latitude = userData.location.coordinates[1];
        const longitude = userData.location.coordinates[0];
        dispatch(setLocation({ lat: latitude, lon: longitude }));
        getAddressBylatlng(latitude, longitude);
    };

    const handlePlaceOrder = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/place-order`, {
                paymentMethod,
                deliveryAddress: {
                    text: addressInput,
                    latitude: location.lat,
                    longitude: location.lon
                },
                totalAmount:AmountWithDeliveryFee,
                cartItems
            }, { withCredentials: true });

            if (paymentMethod == "cod") {
                dispatch(addMyOrders(result.data));
                navigate("/order-placed");
            }
            else {
                const orderId = result.data.orderId
                const razorOrder = result.data.razorOrder
                openRazorpayWindow(orderId, razorOrder)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const openRazorpayWindow = (orderId, razorOrder) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorOrder.amount,
            currency: 'INR',
            description: "Food De;ivery Website",
            order_id: razorOrder.id,
            handler: async function (response) {
                try {
                    const result = await axios.post(`${serverUrl}/api/order/verify-payment`,{
                            razorpay_payment_id: response.razorpay_payment_id,
                            orderId
                        }, { withCredentials: true })
                    dispatch(addMyOrders(result.data));
                    navigate("/order-placed");

                } catch (error) {
                    console.log(error);
                }
            }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    useEffect(() => {
        setAddressInput(address)
    }, [address])
    return (
        <div className='min-h-screen bg-[#fff9f6] flex justify-center p-4 md:p-6'>
            {/* Back Button */}
            <div
                className='absolute top-4 left-4 z-20 cursor-pointer md:top-6 md:left-6'
                onClick={() => navigate("/cart")}
            >
                <IoIosArrowRoundBack size={32} className="text-[#ff4d2d]" />
            </div>

            <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8'>
                <h1 className='text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left'>
                    Checkout
                </h1>

                {/* Delivery Location */}
                <section className='space-y-3'>
                    <h2 className='text-lg md:text-xl font-semibold flex items-center gap-2 text-gray-800'>
                        <IoLocationSharp className='text-[#ff4d2d]' /> Delivery Location
                    </h2>

                    <div className='flex flex-col sm:flex-row gap-2'>
                        <input
                            type="text"
                            className='flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]'
                            placeholder='Enter Your Delivery Address...'
                            value={addressInput}
                            onChange={(e) => setAddressInput(e.target.value)}
                        />
                        <button
                            className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-3 rounded-lg flex items-center justify-center'
                            onClick={getLatLngByAddress}
                        >
                            <IoSearchOutline size={18} />
                        </button>
                        <button
                            className='bg-[#4f46e5] hover:bg-[#4338ca] text-white px-4 py-3 rounded-lg flex items-center justify-center'
                            onClick={getCurrentLocation}
                        >
                            <TbCurrentLocation size={18} />
                        </button>
                    </div>

                    <div className='rounded-xl border overflow-hidden mt-2'>
                        <MapContainer
                            className="w-full h-64 md:h-80"
                            center={[location?.lat, location?.lon]}
                            zoom={16}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <RecenterMap location={location} />
                            <DraggableMarker location={location} />
                        </MapContainer>
                    </div>
                </section>

                {/* Payment Method */}
                <section className='space-y-3'>
                    <h2 className='text-lg md:text-xl font-semibold text-gray-800'>Payment Method</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {/* COD */}
                        <div
                            className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50 shadow-md" : "border-gray-200 hover:border-gray-300"
                                }`}
                            onClick={() => setPaymentMethod("cod")}
                        >
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                                <MdDeliveryDining className='text-green-600 text-xl' />
                            </span>
                            <div>
                                <p className='font-medium text-gray-800'>Cash on Delivery</p>
                                <p className='text-xs text-gray-500'>Pay when your food arrives</p>
                            </div>
                        </div>

                        {/* Online Payment */}
                        <div
                            className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50 shadow-md" : "border-gray-200 hover:border-gray-300"
                                }`}
                            onClick={() => setPaymentMethod("online")}
                        >
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                                <FaMobileScreenButton className='text-purple-700 text-lg' />
                            </span>
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                                <FaCreditCard className='text-blue-700 text-lg' />
                            </span>
                            <div>
                                <p className='font-medium text-gray-800'>UPI / Credit / Debit Card</p>
                                <p className='text-xs text-gray-500'>Pay securely online</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Order Summary */}
                <section className='space-y-3'>
                    <h2 className='text-lg md:text-xl font-semibold text-gray-800'>Order Summary</h2>
                    <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
                        {cartItems?.map((item, index) => (
                            <div key={index} className='flex justify-between text-sm text-gray-700'>
                                <span>{item.name} × {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <hr className='border-gray-200 my-2' />
                        <div className='flex justify-between font-medium text-gray-800'>
                            <span>Subtotal</span>
                            <span>₹{totalAmount}</span>
                        </div>
                        <div className='flex justify-between font-medium text-gray-700'>
                            <span>Delivery Fee</span>
                            <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                        </div>
                        <div className='flex justify-between text-lg font-bold text-[#ff4d2d]'>
                            <span>Total</span>
                            <span>₹{AmountWithDeliveryFee}</span>
                        </div>
                    </div>
                </section>

                <button
                    className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-lg font-semibold transition'
                    onClick={handlePlaceOrder}
                >
                    {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
                </button>
                <footer className="mt-16 mb-4 text-center text-gray-600 text-sm font-medium">
                    <hr className="border-t border-gray-300 w-2/3 mx-auto mb-3" />
                    <p className="flex items-center justify-center gap-2 hover:scale-105 transition-transform duration-300">
                        ✨ MADE BY{" "}
                        <span className="text-[#ff4d2d] font-semibold">RISHU KUMAR</span> 🚀
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default CheckOut;
