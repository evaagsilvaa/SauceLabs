export interface InventoryItem {
  name: string;
  description: string;
  price: string;
  img: string;
}

export interface Translations {
  general: {
    currencySymbol: string;
    qtyText: string;
    descText: string;
    thankYouText: string;
    orderText: string;
  };
  buttons: {
    addToCartBtnText: string;
    removeBtnText: string;
    cancelBtnText: string;
    finishBtnText: string;
    backBtnText: string;
    continueShoppingBtnText: string;
    continueBtnText: string;
  };
  headers: {
    products: string;
    finish: string;
    yourCart: string;
    checkoutInfo: string;
    checkoutOverview: string;
  };
  errorMessages: {
    loginErrorMessageDontMatch: string;
    loginErrorMessageMissingUsername: string;
    yourInfoFirstNameErrorMessage: string;
  };
  checkoutInfo: {
    firstName: string;
    lastName: string;
    zip: string;
    paymentInfoSection: string;
    shippingInfoSection: string;
    shippingInfo: string;
  };
  credentials: {
    validCheckoutInfo: {
      firstName: string;
      lastName: string;
      zip: string;
    };
  };
  inventory: InventoryItem[];  // This should be an array of InventoryItem objects
  sortOptions: {
    az: string;
    za: string;
    lowhigh: string;
    highlow: string;
  };
  footer: {
    footerCopyText: string;
  };
}
