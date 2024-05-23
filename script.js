'use strict';

const API_URL = "https://dummyjson.com/products?limit=0";

const example = {
   id: 1,
   title: "iPhone 9",
   description: "An apple mobile which is nothing like apple",
   price: 549,
   discountPercentage: 12.96,
   rating: 4.69,
   stock: 94,
   brand: "Apple",
   category: "smartphones",
   thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
   images: [
      "https://cdn.dummyjson.com/product-images/1/1.jpg",
      "https://cdn.dummyjson.com/product-images/1/2.jpg",
      "https://cdn.dummyjson.com/product-images/1/3.jpg",
      "https://cdn.dummyjson.com/product-images/1/4.jpg",
      "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"
   ]
};

const getProducts = async function() {
   const res = await fetch(API_URL);
   const data = await res.json();
   const {products} = data;
   return products;
};

const categoriesListEl = document.querySelector(".filter-categories-win-list");
const getCategories = async function() {
   try {
      const products = await getProducts();
      const categories = new Map();
      products.forEach(entry => {
         if(!categories.has(entry.category)) {
            categories.set(entry.category, 1);
         } else {
            categories.set(entry.category, categories.get(entry.category) + 1);
         };
      });
      categories.entries().forEach(entry => {
         const categoryStr = entry[0].split("-").length > 1 
         ? `${entry[0].split("-")[0][0].toUpperCase() + entry[0].split("-")[0].slice(1)} ${entry[0].split("-")[1][0].toUpperCase() + entry[0].split("-")[1].slice(1)}`
         : entry[0][0].toUpperCase() + entry[0].slice(1);
   
         const categoryEl = `
            <li class="my-2 d-flex justify-content-between">
               <label><input type="checkbox" name="category" value="${entry[0]}"> ${categoryStr}</label>
               <span class="category-quantity">(${entry[1]})</span>
            </li>
         `;
         categoriesListEl.insertAdjacentHTML("beforeend", categoryEl);
      });
   } catch(error) {
      console.error(error);
   };
};

// Node elements
const menuBtn = document.querySelector(".navbar-menu-btn");
const cartBtn = document.querySelector(".navbar-cart-btn");
const sectionFilter = document.querySelector(".section-filter");
const sectionCart = document.querySelector(".section-cart");
const sectionProductsMask = document.querySelector(".section-products-mask");

let menuBtnClicked = false;
let cartBtnClicked = false;

// Menu button logic
menuBtn.addEventListener("click", () => {
   if(cartBtnClicked) {
      sectionCart.style.transform = "translateX(100%)";
      cartBtnClicked = false;
   }

   if(!menuBtnClicked) {
      menuBtn.style.transform = "rotate(90deg)";
      sectionProductsMask.classList.remove("d-none");
      sectionFilter.style.transform = "translateX(0%)";
      menuBtnClicked = true;
   } else {
      menuBtn.style.transform = "rotate(0deg)";
      sectionProductsMask.classList.add("d-none");
      sectionFilter.style.transform = "translateX(-100%)";
      menuBtnClicked = false;
   };
});

// Cart button logic
cartBtn.addEventListener("click", () => {
   if(menuBtnClicked) {
      menuBtn.style.transform = "rotate(0deg)";
      sectionFilter.style.transform = "translateX(-100%)";
      menuBtnClicked = false;
   };

   if(!cartBtnClicked) {
      sectionProductsMask.classList.remove("d-none");
      sectionCart.style.transform = "translateX(0%)";
      cartBtnClicked = true;
   } else {
      sectionProductsMask.classList.add("d-none");
      sectionCart.style.transform = "translateX(100%)";
      cartBtnClicked = false;
   };
});

// Fetching inputs data
const submitBtn = document.querySelector(".filter-form-apply-btn");
submitBtn.addEventListener("click", (e) => {
   e.preventDefault();
   const filterInputData = [...sectionFilter.querySelectorAll("input")].filter((entry) => {
      return (entry.checked) || (entry.type === "number" && entry.value !== "");
   });
   filterInputData.forEach(entry => console.log(`${entry.name}: ${entry.value}`));
});

// Filter collapse buttons
const filterCollapseBtn = document.querySelectorAll(".filter-collapse-btn");
filterCollapseBtn.forEach(btn => {
   let filterCollapseBtnClicked = false;
   btn.addEventListener("click", () => {
      if(!filterCollapseBtnClicked) {
         btn.style.transform = "rotate(180deg)";
         filterCollapseBtnClicked = true;
      } else {
         btn.style.transform = "rotate(0deg)";
         filterCollapseBtnClicked = false;
      }
      document.querySelector(`.${btn.dataset.refer}`).classList.toggle("d-none");
   });
});

window.addEventListener("load", () => {
   getCategories();
});