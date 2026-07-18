class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      this.closest('cart-items').updateQuantity(this.dataset.index, 0);
    });
  }
}
customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
  constructor() {
    super();

    // helper variables
    this.cartTotalValue = 0;
    this.cartTotalDiscount = 0;
    this.cartOriginalPrice = 0;

    // elements
    this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');
    this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]')).reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

    // events
    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);
    this.addEventListener('change', this.debouncedOnChange.bind(this));

    // Init items from API to prevent cart content missmatch on browser back/forward commands
    this.renderItems();

    // dev events
    document.addEventListener('ajaxProduct:added', () => {
      this.renderAndShowItems()
    })

    // Free shipping check onload
    this.updateShippingNotification('cart-shipping-notification');
  }

  /**
   *  Debounced onChange event handler. Updates the cart when the user stops clicking quantity buttons.
   * @param {*} event
   */
  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  /**
   * Returns an array of sections to render when the cart is updated. Limit: 5 sections.
   * Does not make the request to the server, only returns the section names to render.
   * @see https://shopify.dev/api/ajax/reference/cart#bundled-section-rendering
   * @returns {Array} Array of sections to render
   */
  getSectionItemsToRender() {
    return ['cart-items','cart-shipping-notification', 'cart-note', 'cart-footer'];
  }

  /**
   * This function is always called when the cart is updated.
   * @param {string} json
   */
  updateCartSections (newHTML) {
    this.getSectionItemsToRender().forEach((item) => {
      const elementToReplace = document.getElementById(item);

      if (!elementToReplace) return;

      // replace old with new
      elementToReplace.innerHTML = newHTML.getElementById(item).innerHTML;

      if (item === 'cart-shipping-notification') {
        this.updateShippingNotification('cart-shipping-notification');
      }
    });
  }

  /**
   * This function handles multi-currency support for the shipping notification bar.
   * This is called when item is added to cart or when the cart is updated.
   * @param {string} selector
   * @param {string*} json - Cart JSON
   */
  updateShippingNotification(selector) {
    const shippingNotificationWrapper = document.getElementById(selector);

    if (!shippingNotificationWrapper) {
      return;
    }

    const shippingNotification = shippingNotificationWrapper.querySelector('[data-free-shipping-notification]');

    let cartTotal = parseInt(shippingNotification.dataset.cartTotal, 10),
        freeShippingTreshold = parseInt(shippingNotification.dataset.threshold,10),
        shopCurrency = shippingNotification.dataset.shopCurrency,
        targetCurrency = shippingNotification.dataset.targetCurrency;

    if (shopCurrency !== targetCurrency) {
      cartTotal = Math.round(cartTotal / (parseFloat(Shopify.currency.rate) || 1 ));
    }

    if (cartTotal > freeShippingTreshold) {
      shippingNotification.classList.add('threshold-reached')
      shippingNotification.querySelector('span').innerHTML = window.cartStrings.shipping_free;
    } else {
      let missingAmount = freeShippingTreshold - cartTotal,
          message = window.cartStrings.shipping_not_free.replace('[amount]', Woolman.Utils.formatMoney(missingAmount));

      shippingNotification.classList.remove('threshold-reached')
      shippingNotification.querySelector('span').innerHTML = message;
    }
  }

  /**
   * Fetches fresh sections from the server and updates the cart.
   * @see https://shopify.dev/api/ajax/reference/cart#bundled-section-rendering
   * @returns {Promise} Promise that resolves when the cart is updated
   */
  async renderItems() {
    fetch(`${routes.cart_url}?section_id=main-cart`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        this.updateCartSections(html);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  /**
   * Fetches fresh sections from the server and updates the cart. This is called when item is added to cart.
   * @see https://shopify.dev/api/ajax/reference/cart#bundled-section-rendering
   * @returns {Promise} Promise that resolves when the cart is updated
   */
  async renderAndShowItems() {
    const parentDrawer = this.closest('[data-drawer]');

    fetch(`${routes.cart_url}?section_id=main-cart`)
      .then((response) => response.text())
      .then((responseText) => {
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        this.updateCartSections(html);

        if (!parentDrawer) return;
        Woolman.ModalsAndDrawers.showModalOrDrawer(parentDrawer.getAttribute('id'))
      })
      .catch((e) => {
        console.error(e);
      });
  }

  /**
   * Updates the quantity of a line item in the cart. This is called when the user changes the quantity of an item in the cart.
   * @param {*} line
   * @param {*} quantity
   * @param {*} name
   */
  async updateQuantity(line, quantity, name) {
    this.enableLoading(line);
    fetch(`${routes.cart_change_url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: `application/json`,
      },
      body: JSON.stringify({
        line: line,
        quantity: quantity,
        sections: 'main-cart',
        sections_url: window.location.pathname,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {

      const quantityElement = document.getElementById(`Quantity-${line}`);
      const items = document.querySelectorAll('.cart-item');

      if (responseJson.errors) {
        quantityElement.value = quantityElement.getAttribute('value');
        this.updateLiveRegions(line, responseJson.errors);
        return;
      }

      const event = new CustomEvent('cart:update', { detail: responseJson,});
      document.dispatchEvent(event);

      // Render new items according to response
      const html = new DOMParser().parseFromString(responseJson.sections['main-cart'], 'text/html');
      this.updateCartSections(html);

      const lineItem = document.getElementById(`CartItem-${line}`);
      if (lineItem && lineItem.querySelector(`[name="${name}"]`)) lineItem.querySelector(`[name="${name}"]`).focus();
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      this.disableLoading();
    });
  }

  /**
   * Updates the live regions for the cart.
   * @param {*} line
   * @param {*} message
   */
  updateLiveRegions(line, message) {
    const lineItemError =
      document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
    if (lineItemError) {
      lineItemError.querySelector('.cart-item__error-text').innerHTML = message;
      lineItemError.classList.remove('hide');
    }

    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus = document.getElementById('cart-live-region-text');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  enableLoading(line) {
    this.classList.add('is-processing');
    this.querySelectorAll(`#CartItem-${line} .loading-overlay`).forEach((overlay) => overlay.classList.remove('hidden'));
    document.activeElement.blur();
  }

  disableLoading() {
    this.classList.remove('is-processing');
    this.querySelectorAll('.loading-overlay').forEach((overlay) => overlay.classList.add('hidden'));
  }
}
customElements.define('cart-items', CartItems);

if (!customElements.get('cart-note')) {
  customElements.define('cart-note', class CartNote extends HTMLElement {
    constructor() {
      super();

      this.addEventListener('keyup', debounce((event) => {
        const body = JSON.stringify({ note: event.target.value });
        fetch(`${routes.cart_update_url}`, {
          method: 'POST',
          headers: {
           'Content-Type': 'application/json',
            Accept: `application/json`,
          },
          ...{ body }
        });
      }, 300))
    }
  });
};

if (!customElements.get('cart-recommendations')) {
  customElements.define('cart-recommendations', class CartRecommendations extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this._boundLoadRecommendations = (e) => {
        const productId = e.detail?.productId ?? this.dataset.productId;
        this.loadRecommendations(productId);
      };
      this._boundCartUpdate = (e) => {
        const itemCount = e.detail?.item_count;
        if (itemCount === 0) {
          this.classList.add('hide');
          this.setAttribute('hidden', true);
          delete this.dataset.productId;
          return;
        }
        this._refreshRecommendationsIfFirstProductChanged(e.detail);
      };
      this.loadRecommendations(this.dataset.productId);
      document.addEventListener('ajaxProduct:added', this._boundLoadRecommendations);
      document.addEventListener('cart:update', this._boundCartUpdate);
    }

    disconnectedCallback() {
      document.removeEventListener('ajaxProduct:added', this._boundLoadRecommendations);
      document.removeEventListener('cart:update', this._boundCartUpdate);
    }

    /**
     * Refreshes recommendations only when the first cart item's product changes.
     * @param {Object} detail - cart:update event detail (may include items, item_count)
     */
    async _refreshRecommendationsIfFirstProductChanged(detail) {
      let firstProductId = detail?.items?.[0]?.product_id;
      if (firstProductId == null && detail?.item_count > 0) {
        try {
          const res = await fetch(`${routes.cart_url}.js`);
          const cart = await res.json();
          firstProductId = cart?.items?.[0]?.product_id;
        } catch (e) {
          return;
        }
      }
      if (firstProductId == null) return;
      const currentProductId = this.dataset.productId ?? '';
      if (String(firstProductId) === currentProductId) return;
      this.dataset.productId = String(firstProductId);
      this.removeAttribute('hidden');
      this.classList.remove('hide');
      this.loadRecommendations();
    }

    /**
     * Loads recommendations for the given product (or current dataset.productId).
     * @param {string|number|undefined} productId - Optional; when provided, used for the request and synced to dataset
     */
    async loadRecommendations(productId) {
      const id = productId ?? this.dataset.productId;
      if (!id || String(id) === '') return;
      if (productId != null) this.dataset.productId = String(productId);

      await this._loadProductCard();
    }

    async _loadProductCard() {
      try {
        let url = `${this.dataset.url}&product_id=${this.dataset.productId}&section_id=${this.dataset.sectionId}`;
        if (this.dataset.intent) url += `&intent=${encodeURIComponent(this.dataset.intent)}`;
        const res = await fetch(url);
        const text = await res.text();
        const html = document.createElement('div');
        html.innerHTML = text;
        const recommendations = html.querySelector('cart-recommendations');
        if (recommendations?.innerHTML?.trim().length) {
          this.innerHTML = recommendations.innerHTML;
          this.removeAttribute('hidden');
          this.classList.remove('hide');
          this.classList.add('products-loaded');
        } else {
          this.setAttribute('hidden', true);
          this.classList.add('hide');
        }
      } catch (e) {
        console.error(e);
        this.setAttribute('hidden', true);
        this.classList.add('hide');
      }
    }
  });
}