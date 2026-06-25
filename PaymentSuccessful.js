window.onload = function () {

    let user =
        JSON.parse(localStorage.getItem("currentUser"));

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    let orders =
        JSON.parse(localStorage.getItem("orders")) || [];

    let products =
        JSON.parse(localStorage.getItem("products")) || [];

    cart.forEach(item => {

        // Create Order
        let order = {

            userId: user.id,

            sellerId: item.sellerId,

            productId: item.productId,

            orderId: "ORD" + Date.now() + Math.floor(Math.random()*1000),

            name: item.productName,

            image: item.imageUrl,

            price: item.finalPrice,

            quantity: item.quantity || 1,

            paymentStatus: "SUCCESS",

            orderStatus: "PENDING",

            orderDate: new Date().toLocaleString()

        };

        orders.push(order);


        // Reduce Stock
        let product = products.find(
            p => p.productId == item.productId
        );

        if(product){

            product.quantity =
                product.quantity - item.quantity;

            if(product.quantity < 0){

                product.quantity = 0;

            }

        }

    });

    localStorage.setItem(
        "orders",
        JSON.stringify(orders));

    localStorage.setItem(
        "products",
        JSON.stringify(products));

    localStorage.removeItem("cart");

}