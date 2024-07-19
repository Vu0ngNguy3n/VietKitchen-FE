export const calculateCartTotal = (cart) => {
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity; 
  });
  return total;
};