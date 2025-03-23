// src/stores/centralStore.js

const categories = [
  {
    id: 1,
    name: "Bridal",
    image: require("../assets/bridal/bridal-image.jpg"),
  },
  {
    id: 2,
    name: "Casual",
    image: require("../assets/Casual/casual-image.jpg"),
  },
  {
    id: 3,
    name: "Corporate",
    image: require("../assets/Corporate/corporate-image.jpg"),
  },
  {
    id: 4,
    name: "Maternity",
    image: require("../assets/Maternity/maternity-image.jpg"),
  },
  {
    id: 5,
    name: "Party Wear",
    image: require("../assets/Party_wear/party-wear-image.jpg"),
  },
  {
    id: 6,
    name: "Street",
    image: require("../assets/Street/street-image.jpg"),
  },
  {
    id: 7,
    name: "Summer Wear",
    image: require("../assets/Summer_wear/summer-wear-image.jpg"),
  },
  { id: 8, name: "Suits", image: require("../assets/suit.jpg") },
];

const products = [
  {
    id: 1,
    name: "Elegant Bridal Gown",
    category: 1,
    price: 299.99,
    image: require("../assets/bridal/bridal-image.jpg"),
  },
  {
    id: 2,
    name: "Casual Summer Dress",
    category: 2,
    price: 49.99,
    image: require("../assets/Casual/casual-image.jpg"),
  },
  {
    id: 3,
    name: "Corporate Suit",
    category: 3,
    price: 199.99,
    image: require("../assets/Corporate/corporate-image.jpg"),
  },
  // Add more products as needed, using images from the respective categories
];

export default {
  categories,
  products,
};
