class ShoppingCart {
    constructor() {
        this.items = []; 
    }

    addToCart(product) {
        let found = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === product.id) {
                this.items[i].quantity += product.quantity || 1;
                found = true;
                break;
            }
        }
        if (!found) {
            if (!product.quantity) product.quantity = 1;
            this.items.push(product);
        }
    }

    removeFromCart(productId) {
        let index = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === productId) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    updateItem(productId, newQuantity) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === productId) {
                this.items[i].quantity = newQuantity;
                break;
            }
        }
    }

    calculateTotalPrice() {
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
            total += this.items[i].price * this.items[i].quantity;
        }
        return total;
    }
}

console.log("*** SHOPPING CART ***");
const cart = new ShoppingCart();

cart.addToCart({ id: 101, title: "ვაშლი", price: 2, quantity: 3 }); 
cart.addToCart({ id: 102, title: "რძე", price: 4, quantity: 1 });  

console.log("საწყისი ჯამური ფასი:", cart.calculateTotalPrice());


cart.addToCart({ id: 102, title: "რძე", price: 4, quantity: 2 });   


cart.updateItem(101, 5); 
console.log("განახლების შემდეგ ჯამი:", cart.calculateTotalPrice());


cart.removeFromCart(102); 
console.log("წაშლის შემდეგ ჯამი:", cart.calculateTotalPrice());
console.log("-------------------------------------------");