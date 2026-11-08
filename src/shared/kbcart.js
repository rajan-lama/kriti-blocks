/**
 * Adds a simple product to the cart through WooCommerce's own AJAX endpoint,
 * then tells the page (and WooCommerce's mini cart) about it.
 *
 * @param {string}        endpoint Add to cart URL from WooCommerce.
 * @param {number|string} id       Product ID.
 * @param {number}        quantity Quantity.
 * @return {Promise<boolean>} True when the product was added.
 */
export function addToCart(endpoint, id, quantity) {
  if (!endpoint) {
    return Promise.resolve(false);
  }
  const body = new URLSearchParams({
    product_id: String(id),
    quantity: String(Math.max(1, parseInt(quantity, 10) || 1)),
  });
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    credentials: 'same-origin',
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data || data.error) {
        return false;
      }
      const $ = window.jQuery;
      if ($ && $.fn) {
        $(document.body).trigger('added_to_cart', [
          data.fragments,
          data.cart_hash,
          null,
        ]);
      }
      return true;
    })
    .catch(function () {
      return false;
    });
}
