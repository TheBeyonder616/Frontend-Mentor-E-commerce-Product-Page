"use strict";
// ------------------------------------------------------Header Section
const header = document.getElementById("header");
const parent = document.getElementById("main");
const menuContentMobile = document.querySelector("[data-menu-content-mobile]");
const menuContent = document.querySelector(
  "[data-menu-content-container-mobile]"
);
const cartMobile = document.querySelector("[data-cart-mobile]");
const cartContentMobile = document.querySelector("[data-cart-content-mobile]"); //parent of cart iteem

// ------------------------------------------------------------Fuctions

const total = document.querySelector("[data-total]");
const priceElement = document.querySelector("[data-price]");
const remove = document.querySelector("[data-delete]");
const quantity = document.querySelectorAll("[data-quantity]");
const addItemToCart = document.querySelector("[cart-quantity-item]");
const addItem = document.querySelector("[data-cartInformation]");
const emptyCartText = document.querySelector("[data-empty-cart]");

const getPrice = (e) => {
  const priceText = e.textContent.trim();
  const match = priceText.match(/[\d.]+/);
  const parsedPrice = match ? parseFloat(match[0]) : 0;
  return parsedPrice;
};

let empty = true;
let currentValue = 0;
let itemPrice = getPrice(priceElement);

const updateCart = (newQuantity, newValue) => {
  if (newQuantity !== undefined) {
    quantity.forEach((qun) => (qun.textContent = newQuantity));
  }
  total.textContent = `$${newValue.toFixed(2)}`;
  empty = newQuantity === 0;
};

// Fuction to save cart to localStorage
const saveCartToLocalStorage = () => {
  try {
    const cart = {
      quantity: currentValue,
      itemPrice: itemPrice,
      totalValue: currentValue * itemPrice,
    };

    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save to loacal storage", err);
  }
};

// Fuction to load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const cartJSON = localStorage.getItem("cart");
    if (cartJSON) {
      const cart = JSON.parse(cartJSON);
      currentValue = cart.quantity;
      itemPrice = cart.itemPrice;
      updateCart(cart.quantity, cart.totalValue);
    } else {
      current = 0;
      itemPrice = getPrice(price);
      updateCart(0, 0);
      empty = true;
    }
    handleCartDisplay(null, false);
  } catch (err) {
    console.error('"Failed to load cart from localStorage:", error');
    // Handle cases where data might be corrupted or missing
    currentValue = 0;
    itemPrice = getPrice(priceElement);
    updateCart(0, 0);
    empty = true;
  }
};

const addToCart = {
  addItem: () => {
    currentValue++;
    const totalValue = currentValue * itemPrice;
    updateCart(currentValue, totalValue);
    saveCartToLocalStorage();
  },
  removeItem: () => {
    if (currentValue <= 0) {
      updateCart(0, 0);
    } else {
      currentValue--;
      const totalValue = currentValue * itemPrice;
      updateCart(currentValue, totalValue);
    }

    saveCartToLocalStorage();
  },
  deletItem: () => {
    currentValue = 0;
    updateCart(0, 0);
    saveCartToLocalStorage();
  },
};

const hanClass = {
  toggle: (el, cl) => el.classList.toggle(cl),
  add: (el, cl) => el.classList.add(cl),
  remove: (el, cl) => el.classList.remove(cl),
};

// ------------------------------------------------------------Main Section
// slider mobile
const slider = parent.querySelectorAll("[slides-mobile]");

//Desktop

const sliderDesktopOVerlay = document.querySelectorAll(
  "[data-slide-overlay-desktop]"
);
const sliderDesktop = document.querySelectorAll("[data-slide-desktop]");
const dots = document.querySelectorAll("[data-slide-control]");
//-----------------------------------------# Slider
// let current = 0;
// // To update slide positon
// const handleUpdateSlide = function (slider) {
//   slider.forEach((slide, index) => {
//     slide.style.transform = `translateX(${(index - current) * 100}%)`;
//   });
// };

// const changeSlide = function (slider, direction) {
//   // Change depending on the direction
//   if (direction === "prev") {
//     current = current > 0 ? current - 1 : slider.length - 1;
//   } else if (direction === "next") {
//     current = current < slider.length - 1 ? current + 1 : 0;
//   }
//   handleUpdateSlide(slider);

// };

let current = 0;
// To update slide positon
const handleUpdateSlide = function (slider) {
  slider.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - current) * 100}%)`;
  });
};

const handleUpdateDot = function (dots) {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === current);
  });
};

const changeSlide = function (slider, direction) {
  // Change depending on the direction
  if (direction === "prev") {
    current = current > 0 ? current - 1 : slider.length - 1;
  } else if (direction === "next") {
    current = current < slider.length - 1 ? current + 1 : 0;
  }
  handleUpdateSlide(slider);
};

const changeSlideDesktop = function (slider, dots, direction) {
  // Change depending on the direction
  if (direction === "prev") {
    current = current > 0 ? current - 1 : slider.length - 1;
  } else if (direction === "next") {
    current = current < slider.length - 1 ? current + 1 : 0;
  }
  handleUpdateSlide(slider);
  handleUpdateDot(dots);
};

const initDot = function (dots, slider) {
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-slide-control"), 10);
      current = index;
      handleUpdateSlide(slider);
      handleUpdateDot(dots);
    });
  });
};

initDot(dots, sliderDesktopOVerlay);
initDot(dots, sliderDesktop);

//--------------------------------------------------------------------------OVERLAY
const overlay = document.querySelector("[data-overlay]");

// -----------------------------------------------------------Cart

const handlebtnOpacity = function (btn) {
  btn.classList.add("active");
  //   remove the active state in .9s
  setTimeout(() => btn.classList.remove("active"), 500);
};

const cartIsRemover = () => {
  addToCart.deletItem();
  hanClass.remove(emptyCartText, "hide");
  hanClass.add(addItem, "hide");
  hanClass.add(addItemToCart, "hide");
};

const cartIsEmpty = () => {
  hanClass.add(addItemToCart, "hide"); // Hide cart quantity icon
  hanClass.add(addItem, "hide"); // Hide cart information
  hanClass.remove(emptyCartText, "hide"); // Show empty cart text
};

const cartIsFull = () => {
  hanClass.remove(addItemToCart, "hide"); // Show cart quantity icon
  hanClass.remove(addItem, "hide"); // Show cart information
  hanClass.add(emptyCartText, "hide"); // Hide empty cart text
};

const cartIsNotVisible = () => {
  hanClass.add(addItemToCart, "hidden");
};

const handleCartDisplay = (btn) => {
  empty && btn ? cartIsEmpty() : cartIsFull();
  if (btn && !empty) hanClass.toggle(addItemToCart, "hidden");
};
// ----------------------------------------------------------------Scrool to

const scrollto = function (id, overlay) {
  const targetid = id.getAttribute("href").substring(1);
  const element = document.getElementById(targetid);

  if (element) {
    if (overlay) overlay.classList.add("hide");
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const handleScroolIntoView = function (dataList) {
  //   Converting the child to an array
  const chidren = Array.from(dataList.children);
  chidren.forEach((child) => {
    // selecting the tag
    const aTref = child.children[0];
    aTref.addEventListener("click", function (e) {
      e.preventDefault();
      scrollto(this, overlay);
    });
  });
};

// -------------------------------------------------------------------LazyLoad
const targetImgs = document.querySelectorAll("img[data-src]");

const handleLazyLoad = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    // Changing the data src
    const img = entry.target;
    img.src = img.dataset.src;

    img.addEventListener("load", function () {
      //Removing the Skeleton animation
      const parent = img.parentNode;
      img.classList.remove("lazy-img");
      parent.classList.remove("lazy-img-container");
    });

    // Unobserving the target
    observer.unobserve(img);
  });
};

const options = {
  root: null,
  threshold: 0,
};

const lazyObserver = new IntersectionObserver(handleLazyLoad, options);
targetImgs.forEach((img) => lazyObserver.observe(img));

// -------------------------------------------------------------Event

header.addEventListener("click", function (e) {
  e.preventDefault();

  const cartBtnMobile = e.target.closest("[data-cart-btn-mobile]");
  const profileMobile = e.target.closest("[data-profile-mobile]");
  const menuMobile = e.target.closest("[data-menu-mobile]");
  const closeMenu = e.target.closest("[data-close-menu]");
  const menuOVerlay = e.target.closest("[data-menu-overlay]");
  const removeAll = e.target.closest("[data-delete]");
  const checkout = e.target.closest("[data-checkout]");

  // -----------------------------------------------------ScrollInView
  const navListMobile = e.target.closest("[data-list-mobile]");
  const navListDesktop = e.target.closest("[data-list-desktop]");

  if (cartBtnMobile || profileMobile) {
    setTimeout(() => hanClass.toggle(cartMobile, "hide"), 800);
    hanClass.toggle(cartContentMobile, "translate");
  }

  if (menuMobile) {
    hanClass.remove(menuContentMobile, "hide");
    setTimeout(() => {
      hanClass.add(menuContent, "contentwidth");
    }, 500);
  }
  if (closeMenu || menuOVerlay) {
    hanClass.remove(menuContent, "contentwidth");
    setTimeout(() => hanClass.add(menuContentMobile, "hide"), 100);
  }

  if (removeAll) {
    cartIsRemover();
  }

  if (checkout) {
    cartIsRemover();
    setTimeout(() => alert("Order in Progress 😊 :)"), 500);
  }

  if (navListDesktop) {
    handleScroolIntoView(navListDesktop);
  }
  if (navListMobile) {
    handleScroolIntoView(navListMobile);
    hanClass.remove(menuContent, "contentwidth");
    setTimeout(() => hanClass.add(menuContentMobile, "hide"), 500);
  }
});

parent.addEventListener("click", function (e) {
  e.preventDefault();

  const nextContainer = e.target.closest("[data-next-container]");
  const nextbtn = e.target.closest("[data-next]");
  const prevContainer = e.target.closest("[data-prev-container]");
  const prevtbtn = e.target.closest("[data-prev]");
  // ----------------------------------------Desktop
  const openOVerlay = e.target.closest("[data-slide-container]");
  const closeOverlayBtn = e.target.closest("[data-closebtn]");
  const rightbtn = e.target.closest("[data-nextbtn]");
  const leftbtn = e.target.closest("[data-previous]");

  // -------------------------------------------Cart
  const addToCartBtn = e.target.closest("[data-addtoCart]");
  // Cart
  const reduce = e.target.closest("[data-reduce]");
  const increas = e.target.closest("[data-increase]");

  if (nextContainer || nextbtn) {
    changeSlide(slider, "next");
    handlebtnOpacity(nextContainer);
  }

  if (prevContainer || prevtbtn) {
    changeSlide(slider, "prev");
    handlebtnOpacity(prevContainer);
  }

  // Cart
  if (reduce) {
    addToCart.removeItem();
    cartIsNotVisible();
    if (empty) {
      cartIsNotVisible();
    }
  }

  if (increas) {
    addToCart.addItem();
    cartIsNotVisible();
  }

  // If Btn is clicked
  handleCartDisplay(addToCartBtn);

  // -------------------------------------SLider desktop

  if (closeOverlayBtn) {
    hanClass.add(overlay, "hide");
  }

  if (openOVerlay) {
    hanClass.remove(overlay, "hide");
  }

  if (rightbtn) {
    changeSlideDesktop(sliderDesktopOVerlay, dots, "next");
  }
  if (leftbtn) {
    changeSlideDesktop(sliderDesktopOVerlay, dots, "prev");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Get the cart from local storage
  loadCartFromLocalStorage();
});
