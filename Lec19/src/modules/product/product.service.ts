import Product, { IProduct } from "./product.model";

// ყველა პროდუქტის წამოღება
export async function getAllProducts() {
  return Product.find().sort({ createdAt: -1 });
}

// ერთი პროდუქტის წამოღება ID-ით
export async function getProductById(id: string) {
  return Product.findById(id);
}

// ახალი პროდუქტის დამატება
export async function createProduct(data: Partial<IProduct>) {
  return Product.create(data);
}

// პროდუქტის განახლება
export async function updateProduct(id: string, data: Partial<IProduct>) {
  return Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

// პროდუქტის წაშლა
export async function deleteProduct(id: string) {
  return Product.findByIdAndDelete(id);
}
