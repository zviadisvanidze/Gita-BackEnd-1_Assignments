import Product, { IProduct } from "./product.model";


export async function getAllProducts() {
  return Product.find().sort({ createdAt: -1 });
}


export async function getProductById(id: string) {
  return Product.findById(id);
}


export async function createProduct(data: Partial<IProduct>) {
  return Product.create(data);
}


export async function updateProduct(id: string, data: Partial<IProduct>) {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}


export async function deleteProduct(id: string) {
  return Product.findByIdAndDelete(id);
}
