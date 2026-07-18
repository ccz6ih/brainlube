if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();
      this.multi_item_request = false;
    }

    connectedCallback() {
      if (this._productFormInitialized) return;
      this.form = this.querySelector('form');
      if (!this.form) return;
      const idInput = this.form.querySelector('[name=id]');
      if (idInput) idInput.disabled = false;
      this._boundSubmitHandler = this.onSubmitHandler.bind(this);
      this.form.addEventListener('submit', this._boundSubmitHandler);
      this.submitButton = this.querySelector('[type="submit"]');
      this.cartNotification = document.getElementById('cart-notification');
      this.cartNotificationItem = document.getElementById('cart-notification-item');
      this._productFormInitialized = true;
    }

    disconnectedCallback() {
      if (this.form && this._boundSubmitHandler) {
        this.form.removeEventListener('submit', this._boundSubmitHandler);
      }
      this._productFormInitialized = false;
    }

    /**
     * Resolves product id for ajaxProduct:added from add response and existing DOM/form.
     * @param {Object} json - Cart add API response
     * @returns {string|number|undefined}
     */
    getProductIdForEvent(json) {
      if (json?.product_id != null) return json.product_id;
      if (json?.items?.[0]?.product_id != null) return json.items[0].product_id;
      const fromPicker = this.querySelector('[data-product-id]')?.dataset?.productId;
      if (fromPicker != null && fromPicker !== '') return fromPicker;
      const fromParent = this.closest('[data-product]')?.dataset?.product;
      if (fromParent != null && fromParent !== '') return fromParent;
      const formId = this.form?.id ?? '';
      if (/^product-form-\d+$/.test(formId)) return formId.replace(/^product-form-/, '');
      if (formId.includes('-upsell-')) return formId.split('-upsell-')[1] ?? '';
      if (json?.id != null) return json.id;
      return undefined;
    }

    async onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay').classList.remove('hidden');

      // Upsell items handled only in JS
      const upsell_ids_nodes = document.querySelectorAll(`[data-form="${this.form.getAttribute('id')}"] .upsell-id`);
      const upsell_quantities_nodes = document.querySelectorAll(`[data-form="${this.form.getAttribute('id')}"] .upsell-quantity`);
      let upsell_items = [];

      if (upsell_ids_nodes.length !== 0) {
        const upsell_ids = Array.from(upsell_ids_nodes).map(input => parseInt(input.value));
        const upsell_quantities = Array.from(upsell_quantities_nodes).map(input => parseInt(input.value));
        upsell_items = upsell_ids.map((id, index) => ({'id': id,'quantity': upsell_quantities[index]})).filter(item => item.quantity !== 0);
      }

      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/javascript',
        }
      }
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];
      const formData = new FormData(this.form);

      // If upsell items added refactor FormData
      if (upsell_items.length > 0) {
        this.multi_item_request = true;
        const items = upsell_items;
        const id = parseInt(formData.get('id'));
        const quantity = parseInt(formData.get('quantity')) || 1;
        const the_product_item = { 'id': id, 'quantity': quantity }

        items.push(the_product_item);
        const itemsData = { 'items': items };

        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(itemsData);
      } else {
        this.multi_item_request = false;
        config.body = formData;
      }

      try {
        const res = await fetch(routes.cart_add_url + '.js', config)
        const json = await res.json();

        if (res.status !== 200) throw new Error(json.description);

        if (this.cartNotification) {
          const notificationTemplate = document.importNode(this.cartNotification.content, true);

          if (this.multi_item_request) {
            notificationTemplate.querySelector('[data-notification-title]').textContent = window.variantStrings.itemsAdded;
            let lastElement = json.items.pop();
            json.items.unshift(lastElement);

            json.items.forEach(item => {
              const singleItem = this.createNotificationItem(item);
              notificationTemplate.querySelector('[data-items]').appendChild(singleItem);
            });
          } else {
            notificationTemplate.querySelector('[data-notification-title]').textContent = window.variantStrings.itemAdded;
            const singleItem = this.createNotificationItem(json);
            notificationTemplate.querySelector('[data-items]').appendChild(singleItem);
          }

          if (document.querySelector('.cart-notification')) {
            document.querySelector('.cart-notification').remove();
          }

          document.body.appendChild(notificationTemplate);

          const the_notification = document.querySelector('.cart-notification');

          // Set focus to the notification for accessibility
          the_notification.setAttribute('tabindex', '-1');
          the_notification.focus();

          the_notification.querySelector('.notification-close').addEventListener('click', () => {
            the_notification.classList.remove('anim-in');
          });
          setTimeout(() => {
            the_notification.classList.add('anim-in');
          }, 50);
        }

        const productId = this.getProductIdForEvent(json);
        const event = new CustomEvent('ajaxProduct:added', { detail: productId != null ? { productId } : {} });
        document.dispatchEvent(event);
      } catch(error) {
        this.handleErrorMessage(error);
        console.error(error);
      }

      this.submitButton.classList.remove('loading');
      this.submitButton.removeAttribute('aria-disabled');
      this.querySelector('.loading-overlay').classList.add('hidden');
      this.resetQuantityInput();
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper') || document.querySelector(`.product-form__error-message-wrapper[form="${this.form.getAttribute('id')}"]`)
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }

    resetQuantityInput() {
      const hidden_quantity_input = document.querySelector('[type=hidden][name=quantity]');
      if (hidden_quantity_input) {
        hidden_quantity_input.value = 1;
      }
    }

    createNotificationItem(product) {
      const notificationItemTemplate = document.importNode(this.cartNotificationItem.content, true);

      const filename = product.image.split('/').pop();
      const lastDotIndex = filename.lastIndexOf('.');
      const newFilename = `${filename.substring(0, lastDotIndex)}_120x${filename.substring(lastDotIndex)}`;
      const url = product.image.replace(filename, newFilename);

      notificationItemTemplate.querySelector('.notification-item-image').setAttribute('src', url);
      notificationItemTemplate.querySelector('.notification-item-image').classList.remove('hide');
      notificationItemTemplate.querySelector('.notification-item-title').textContent = product.product_title;

      product.options_with_values.forEach(item => {
        const row = document.createElement("dl");
        const nameCell = document.createElement("dt");
        const valueCell = document.createElement("dd");

        nameCell.textContent = item.name + ': ';
        valueCell.textContent = item.value;

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        notificationItemTemplate.querySelector('.notification-item-details').appendChild(row);
      })

      const propertyKeyValues = Object.entries(product.properties);
      if (propertyKeyValues.length > 0) {
        const properties = document.createElement("dl");
        propertyKeyValues.forEach(([key, value]) => {
          const startsWith = key.startsWith('_');
          if (startsWith) return;
          const row = document.createElement("dl");
          const nameCell = document.createElement("dt");
          const valueCell = document.createElement("dd");

          nameCell.textContent = key + ': ';
          valueCell.textContent = value;

          row.appendChild(nameCell);
          row.appendChild(valueCell);
          properties.appendChild(row);
        });
        notificationItemTemplate.querySelector('.notification-item-details').appendChild(properties);
      }

      return notificationItemTemplate;
    }
  });
}

class AddMultiplier extends HTMLElement {
  constructor() {
    super();

    const multiplyButton = this.querySelector('button');
    this.submitEvent = new SubmitEvent("submit", { submitter: multiplyButton });
    this.multiplyBy = parseInt(this.querySelector('[name=multiplied-quantity]').value);
    this.productForm = this.closest('product-form').querySelector('form');
    const formId = this.productForm.getAttribute('id');
    this.quantity_input = document.querySelector(`[name=quantity][form=${ formId }]`);
    multiplyButton.addEventListener('click', this.submitProductForm.bind(this));
  }

  submitProductForm() {
    this.quantity_input.value = this.multiplyBy;
    this.productForm.dispatchEvent(this.submitEvent);
  }
}
customElements.define("add-multiplier", AddMultiplier);
