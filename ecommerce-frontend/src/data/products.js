const Products = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 99.99,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w-600&h=400&fit=crop"
    ],
    feedbacks: [
      { id: 1, user: "John D.", rating: 5, comment: "Excellent sound quality!", date: "2024-01-15" },
      { id: 2, user: "Sarah M.", rating: 4, comment: "Good battery life, comfortable to wear.", date: "2024-01-20" }
    ]
  },
  {
    id: 2,
    title: "Smart Watch Series 5",
    price: 249.99,
    category: "Electronics",
    description: "Advanced smartwatch with health monitoring, GPS, and waterproof design. Track your fitness goals in style.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop"
    ],
    feedbacks: [
      { id: 1, user: "Mike T.", rating: 5, comment: "Best smartwatch I've owned!", date: "2024-02-10" }
    ]
  },
  {
    id: 3,
    title: "Running Shoes Pro",
    price: 89.99,
    category: "Sports",
    description: "Lightweight running shoes with superior cushioning and support for all types of runners.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    images: [],
    feedbacks: []
  },
  {
    id: 4,
    title: "Leather Backpack",
    price: 129.99,
    category: "Fashion",
    description: "Genuine leather backpack with multiple compartments, laptop sleeve, and water-resistant lining.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    images: [],
    feedbacks: [
      { id: 1, user: "Emma L.", rating: 4, comment: "Great quality leather, very stylish.", date: "2024-03-05" }
    ]
  },
  {
    id: 5,
    title: "Coffee Maker Deluxe",
    price: 149.99,
    category: "Home",
    description: "Programmable coffee maker with thermal carafe, built-in grinder, and multiple brew strength options.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    images: [],
    feedbacks: []
  },
  {
    id: 6,
    title: "Yoga Mat Premium",
    price: 34.99,
    category: "Sports",
    description: "Extra thick non-slip yoga mat with alignment lines and carrying strap. Perfect for all yoga practices.",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop",
    images: [],
    feedbacks: [
      { id: 1, user: "Lisa K.", rating: 5, comment: "Very comfortable and doesn't slip!", date: "2024-03-12" }
    ]
  },
  {
    id: 7,
    title: "Bluetooth Speaker",
    price: 79.99,
    category: "Electronics",
    description: "Portable Bluetooth speaker with 360° sound, waterproof design, and 12-hour battery life.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    images: [],
    feedbacks: []
  },
  {
    id: 8,
    title: "Fitness Tracker",
    price: 59.99,
    category: "Electronics",
    description: "Activity tracker with heart rate monitor, sleep tracking, and smartphone notifications.",
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=400&h=300&fit=crop",
    images: [],
    feedbacks: []
  }
];

export default Products;