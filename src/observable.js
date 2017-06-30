export class Observable {
  constructor() {
    this.callbacks = {};
    this.values = {};
  }

  /**
   * Checks if a property has at least one subscriber
   * 
   * @param {string} property - Property name
   * @returns {boolean}
   */
  has(property) {
    return property in this.callbacks && this.callbacks[property].length > 0;
  }

  /**
   * Subscribes on property change
   * 
   * @param {string} property - Property name
   * @param {function} callback
   * @returns {object} Observable
   */
  on(property, callback) {
    if (property in this.callbacks === false) {
      this.callbacks[property] = [];
    }
    this.callbacks[property].push(callback);
    return this;
  }

  /**
   * Calls the property's callbacks
   * 
   * @param {string} property - Property name
   * @param {object} value - New value
   * @returns {boolean}
   */
  change(property, value) {
    if (property in this.callbacks === false) {
      return false;
    }
    const _value = this.values[property];
    this.values[property] = value;
    this.callbacks[property].forEach(с => с(value, _value));
    return true;
  }

  /**
   * Unsubscribes from property change
   * 
   * @param {function} callback
   * @returns {boolean} if successfully unsubscribed
   */
  off(callback) {
    for (const property in this.callbacks) {
      const cc = this.callbacks[property];
      cc.forEach((c, i) => {
        if (c === callback) {
          cc.splice(i, 1);
          return true;
        }
      });
    }
    return false;
  }

  /**
   * Subscribes on property change once
   * 
   * @param {string} property 
   * @param {function} callback 
   */
  once(property, callback) {
    const method = value => {
      const _value = this.values[property];
      callback(value, _value);
      this.off(method);
    };
    this.on(property, method);
  }
}
