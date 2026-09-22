// Mock Data for Bhoj Phase 1 Prototype

const mockPantry = [
    {
        id: 1,
        name: "Milk",
        quantity: "1 Liter",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80",
        expiryDate: "2026-09-15", // Expiring today
        daysRemaining: 0,
        status: "danger",
        statusText: "Expiring Today"
    },
    {
        id: 2,
        name: "Bread",
        quantity: "1 Loaf",
        image: "https://images.unsplash.com/photo-1598128558393-70ff21433be0?auto=format&fit=crop&w=300&q=80",
        expiryDate: "2026-09-17",
        daysRemaining: 2,
        status: "warning",
        statusText: "Use Soon"
    },
    {
        id: 3,
        name: "Tomatoes",
        quantity: "500g",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80",
        expiryDate: "2026-09-16",
        daysRemaining: 1,
        status: "warning",
        statusText: "Use Soon"
    },
    {
        id: 4,
        name: "Paneer",
        quantity: "200g",
        image: "https://images.unsplash.com/photo-1631451095764-9facf6244435?auto=format&fit=crop&w=300&q=80",
        expiryDate: "2026-09-22",
        daysRemaining: 7,
        status: "success",
        statusText: "Fresh"
    },
    {
        id: 5,
        name: "Yogurt",
        quantity: "400g",
        image: "https://images.unsplash.com/photo-1584270275816-1f9dbcb86016?auto=format&fit=crop&w=300&q=80",
        expiryDate: "2026-09-14",
        daysRemaining: -1,
        status: "danger",
        statusText: "Expired"
    }
];

const mockRecipes = [
    {
        "id": "recipe-001",
        "title": "Biscuit Cake",
        "description": "A soft cake made from crushed biscuits and milk.",
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/P6aY4y6lRDE",
        "time": "40",
        "difficulty": "Easy",
        "servings": 4,
        "tags": [
            "Vegetarian",
            "Dessert"
        ],
        "ingredients": [
            {
                "name": "Biscuit",
                "quantity": 20,
                "unit": "pieces"
            },
            {
                "name": "Milk",
                "quantity": 1,
                "unit": "cup"
            },
            {
                "name": "Sugar",
                "quantity": 2,
                "unit": "tbsp"
            },
            {
                "name": "Baking Powder",
                "quantity": 1,
                "unit": "tsp"
            }
        ],
        "steps": [
            {
                "title": "Crush the biscuits",
                "description": "Break the biscuits into small pieces and crush them into a fine powder."
            },
            {
                "title": "Prepare the batter",
                "description": "Add milk and sugar gradually while mixing until a smooth batter forms."
            },
            {
                "title": "Add raising agent",
                "description": "Stir in the baking powder gently."
            },
            {
                "title": "Cook",
                "description": "Pour into a greased pan and bake or steam until a toothpick comes out clean."
            },
            {
                "title": "Serve",
                "description": "Let it cool before slicing."
            }
        ]
    },
    {
        "id": "recipe-002",
        "title": "Chocolate Biscuit Cake",
        "description": "A decadent chocolate version of the classic biscuit cake.",
        "image": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/nU2U_B1T7dM",
        "time": "45",
        "difficulty": "Easy",
        "servings": 4,
        "tags": [
            "Vegetarian",
            "Dessert"
        ],
        "ingredients": [
            {
                "name": "Biscuit",
                "quantity": 20,
                "unit": "pieces"
            },
            {
                "name": "Milk",
                "quantity": 1,
                "unit": "cup"
            },
            {
                "name": "Chocolate",
                "quantity": 50,
                "unit": "g"
            },
            {
                "name": "Sugar",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Crush the biscuits",
                "description": "Crush biscuits finely."
            },
            {
                "title": "Melt chocolate",
                "description": "Melt the chocolate and mix it with milk and sugar."
            },
            {
                "title": "Combine",
                "description": "Mix the chocolate milk with biscuit powder to form a batter."
            },
            {
                "title": "Cook",
                "description": "Bake or steam until cooked."
            },
            {
                "title": "Serve",
                "description": "Cool and serve with chocolate syrup."
            }
        ]
    },
    {
        "id": "recipe-003",
        "title": "Biscuit Pudding",
        "description": "A creamy, chilled dessert layered with biscuits.",
        "image": "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/v9Z5vE5bTng",
        "time": "15",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Dessert"
        ],
        "ingredients": [
            {
                "name": "Biscuit",
                "quantity": 10,
                "unit": "pieces"
            },
            {
                "name": "Milk",
                "quantity": 2,
                "unit": "cups"
            },
            {
                "name": "Sugar",
                "quantity": 3,
                "unit": "tbsp"
            },
            {
                "name": "Custard Powder",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Make custard",
                "description": "Boil milk, add sugar and custard powder to make a thick custard."
            },
            {
                "title": "Layering",
                "description": "In a dish, lay down biscuits and pour hot custard over them."
            },
            {
                "title": "Repeat",
                "description": "Repeat the layers."
            },
            {
                "title": "Chill",
                "description": "Refrigerate for 2 hours before serving."
            }
        ]
    },
    {
        "id": "recipe-004",
        "title": "Biscuit Milkshake",
        "description": "A thick, creamy milkshake blended with biscuits.",
        "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/m7sA18sUvD4",
        "time": "5",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Drinks"
        ],
        "ingredients": [
            {
                "name": "Biscuit",
                "quantity": 4,
                "unit": "pieces"
            },
            {
                "name": "Milk",
                "quantity": 1,
                "unit": "cup"
            },
            {
                "name": "Ice Cream",
                "quantity": 1,
                "unit": "scoop"
            }
        ],
        "steps": [
            {
                "title": "Blend",
                "description": "Put biscuits, milk, and ice cream in a blender."
            },
            {
                "title": "Mix",
                "description": "Blend until smooth."
            },
            {
                "title": "Serve",
                "description": "Pour into a tall glass and top with a crushed biscuit."
            }
        ]
    },
    {
        "id": "recipe-005",
        "title": "Biscuit Chocolate Balls",
        "description": "No-bake sweet treats rolled with crushed biscuits and chocolate.",
        "image": "https://images.unsplash.com/photo-1548843233-8eb139cf0130?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "15",
        "difficulty": "Easy",
        "servings": 4,
        "tags": [
            "Vegetarian",
            "Dessert",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Biscuit",
                "quantity": 15,
                "unit": "pieces"
            },
            {
                "name": "Chocolate",
                "quantity": 100,
                "unit": "g"
            },
            {
                "name": "Milk",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Crush",
                "description": "Crush the biscuits into a fine powder."
            },
            {
                "title": "Melt chocolate",
                "description": "Melt chocolate and add to the biscuit powder along with a little milk."
            },
            {
                "title": "Roll",
                "description": "Roll the mixture into small bite-sized balls."
            },
            {
                "title": "Set",
                "description": "Refrigerate for 30 minutes."
            }
        ]
    },
    {
        "id": "recipe-biscuit-cheesecake",
        "title": "Biscuit Cheesecake",
        "description": "A delicious cheesecake with a crushed biscuit base.",
        "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "60",
        "difficulty": "Medium",
        "servings": 6,
        "tags": [
            "Vegetarian",
            "Dessert"
        ],
        "ingredients": [
            {
                "name": "Biscuit",
                "quantity": 20,
                "unit": "pieces"
            },
            {
                "name": "Cream Cheese",
                "quantity": 200,
                "unit": "g"
            },
            {
                "name": "Butter",
                "quantity": 4,
                "unit": "tbsp"
            },
            {
                "name": "Sugar",
                "quantity": 4,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Prepare base",
                "description": "Mix crushed biscuits with melted butter and press into a pan."
            },
            {
                "title": "Make filling",
                "description": "Beat cream cheese and sugar until smooth."
            },
            {
                "title": "Combine",
                "description": "Pour filling over the base."
            },
            {
                "title": "Chill",
                "description": "Refrigerate for at least 4 hours before serving."
            }
        ]
    },
    {
        "id": "recipe-006",
        "title": "Bread Pizza",
        "description": "A quick pizza using bread slices as the base.",
        "image": "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "15",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 2,
                "unit": "slices"
            },
            {
                "name": "Tomato",
                "quantity": 0.5,
                "unit": "piece"
            },
            {
                "name": "Onion",
                "quantity": 0.5,
                "unit": "piece"
            },
            {
                "name": "Cheese",
                "quantity": 2,
                "unit": "tbsp"
            },
            {
                "name": "Tomato Sauce",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Prep",
                "description": "Spread tomato sauce evenly on the bread slices."
            },
            {
                "title": "Toppings",
                "description": "Add finely chopped tomato, onion, and any other veggies."
            },
            {
                "title": "Cheese",
                "description": "Sprinkle cheese generously on top."
            },
            {
                "title": "Cook",
                "description": "Toast in a pan or oven until the cheese melts and bread is crispy."
            }
        ]
    },
    {
        "id": "recipe-007",
        "title": "Bread Omelette",
        "description": "Classic street-style bread coated in egg omelette.",
        "image": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/7xI6n-A7P_g",
        "time": "10",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Non-Vegetarian",
            "Breakfast"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 2,
                "unit": "slices"
            },
            {
                "name": "Egg",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 0.5,
                "unit": "piece"
            },
            {
                "name": "Butter",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Beat eggs",
                "description": "Beat the eggs with finely chopped onions, salt, and pepper."
            },
            {
                "title": "Heat pan",
                "description": "Melt butter in a hot pan and pour the egg mixture."
            },
            {
                "title": "Add bread",
                "description": "Place the bread slices side-by-side on the wet egg mixture."
            },
            {
                "title": "Flip",
                "description": "Once the bottom is cooked, flip the entire omelette and fold the edges over the bread."
            }
        ]
    },
    {
        "id": "recipe-008",
        "title": "French Toast",
        "description": "Sweet bread slices soaked in milk and egg.",
        "image": "https://images.unsplash.com/photo-1484723091791-009e322f0402?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/kG5rU4EwSvs",
        "time": "15",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Breakfast"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 4,
                "unit": "slices"
            },
            {
                "name": "Milk",
                "quantity": 0.5,
                "unit": "cup"
            },
            {
                "name": "Sugar",
                "quantity": 2,
                "unit": "tbsp"
            },
            {
                "name": "Butter",
                "quantity": 1,
                "unit": "tbsp"
            },
            {
                "name": "Egg",
                "quantity": 1,
                "unit": "piece"
            }
        ],
        "steps": [
            {
                "title": "Mix",
                "description": "Whisk the egg, milk, sugar, and a pinch of cinnamon."
            },
            {
                "title": "Soak",
                "description": "Dip each bread slice in the mixture to coat it lightly."
            },
            {
                "title": "Cook",
                "description": "Toast the bread on a buttered pan until golden brown on both sides."
            }
        ]
    },
    {
        "id": "recipe-009",
        "title": "Bread Upma",
        "description": "A savory South-Indian style dish made from cubed bread.",
        "image": "https://images.unsplash.com/photo-1627308595171-d1b5d6796245?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/E-2cQ8lZ390",
        "time": "15",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Breakfast"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 4,
                "unit": "slices"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Tomato",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Oil",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Cut bread",
                "description": "Cut bread slices into small cubes."
            },
            {
                "title": "Sauté",
                "description": "Heat oil, add mustard seeds, chopped onions, and sauté until translucent."
            },
            {
                "title": "Add tomatoes",
                "description": "Add chopped tomatoes, salt, and spices, and cook until soft."
            },
            {
                "title": "Mix",
                "description": "Add the bread cubes and toss well to coat."
            }
        ]
    },
    {
        "id": "recipe-010",
        "title": "Bread Sandwich",
        "description": "A simple, customizable fresh vegetable sandwich.",
        "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "10",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 2,
                "unit": "slices"
            },
            {
                "name": "Tomato",
                "quantity": 0.5,
                "unit": "piece"
            },
            {
                "name": "Onion",
                "quantity": 0.5,
                "unit": "piece"
            },
            {
                "name": "Butter",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Prep",
                "description": "Butter the inside of both bread slices."
            },
            {
                "title": "Layer",
                "description": "Layer thinly sliced tomatoes and onions."
            },
            {
                "title": "Season",
                "description": "Sprinkle salt and pepper."
            },
            {
                "title": "Close",
                "description": "Close the sandwich and optionally grill or toast it."
            }
        ]
    },
    {
        "id": "recipe-bread-rolls",
        "title": "Bread Rolls",
        "description": "Crispy fried rolls stuffed with a spicy potato filling.",
        "image": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "30",
        "difficulty": "Medium",
        "servings": 3,
        "tags": [
            "Vegetarian",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 6,
                "unit": "slices"
            },
            {
                "name": "Potato",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Oil",
                "quantity": 2,
                "unit": "cups"
            }
        ],
        "steps": [
            {
                "title": "Prepare filling",
                "description": "Mash boiled potatoes and mix with chopped onions and spices."
            },
            {
                "title": "Soak bread",
                "description": "Briefly dip bread slices in water and squeeze out the excess."
            },
            {
                "title": "Stuff",
                "description": "Place filling in the center of the bread and roll tightly."
            },
            {
                "title": "Fry",
                "description": "Deep fry until crisp and golden."
            }
        ]
    },
    {
        "id": "recipe-011",
        "title": "Tomato Rice",
        "description": "A tangy and flavorful one-pot rice dish with fresh tomatoes.",
        "image": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/io55TbVqJRY",
        "time": "30",
        "difficulty": "Easy",
        "servings": 3,
        "tags": [
            "Vegetarian",
            "Lunch"
        ],
        "ingredients": [
            {
                "name": "Rice",
                "quantity": 1.5,
                "unit": "cups"
            },
            {
                "name": "Tomato",
                "quantity": 4,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Oil",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Wash rice",
                "description": "Wash the rice and set aside."
            },
            {
                "title": "Sauté",
                "description": "Heat oil, sauté onions until golden."
            },
            {
                "title": "Cook tomatoes",
                "description": "Add chopped tomatoes and cook until they turn mushy."
            },
            {
                "title": "Simmer",
                "description": "Stir in rice, water, and spices. Cover and cook until tender."
            }
        ]
    },
    {
        "id": "recipe-012",
        "title": "Tomato Pasta",
        "description": "A quick, classic Italian pasta tossed in fresh tomato sauce.",
        "image": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "25",
        "difficulty": "Medium",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Dinner"
        ],
        "ingredients": [
            {
                "name": "Pasta",
                "quantity": 200,
                "unit": "g"
            },
            {
                "name": "Tomato",
                "quantity": 4,
                "unit": "pieces"
            },
            {
                "name": "Garlic",
                "quantity": 3,
                "unit": "cloves"
            },
            {
                "name": "Olive Oil",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Boil pasta",
                "description": "Boil the pasta in salted water until al dente and drain."
            },
            {
                "title": "Sauté",
                "description": "Sauté minced garlic in olive oil."
            },
            {
                "title": "Make sauce",
                "description": "Add chopped tomatoes and cook until a thick sauce forms."
            },
            {
                "title": "Toss",
                "description": "Toss the boiled pasta into the sauce and serve."
            }
        ]
    },
    {
        "id": "recipe-013",
        "title": "Creamy Tomato Soup",
        "description": "A warm, comforting bowl of classic tomato soup.",
        "image": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/-25_3sQ-pZ4",
        "time": "30",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Soup",
            "Dinner"
        ],
        "ingredients": [
            {
                "name": "Tomato",
                "quantity": 6,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Garlic",
                "quantity": 3,
                "unit": "cloves"
            },
            {
                "name": "Butter",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Sauté",
                "description": "Melt butter and sauté garlic and onions."
            },
            {
                "title": "Boil",
                "description": "Add tomatoes and water, bring to a boil, and simmer."
            },
            {
                "title": "Blend",
                "description": "Blend the mixture until smooth."
            },
            {
                "title": "Serve",
                "description": "Season with salt and pepper and serve hot."
            }
        ]
    },
    {
        "id": "recipe-014",
        "title": "Tomato Egg Curry",
        "description": "A spicy and comforting curry made with boiled eggs and tomatoes.",
        "image": "https://images.unsplash.com/photo-1631451095764-9facf6244435?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/yPz19_WfGkE",
        "time": "30",
        "difficulty": "Medium",
        "servings": 2,
        "tags": [
            "Non-Vegetarian",
            "Dinner"
        ],
        "ingredients": [
            {
                "name": "Egg",
                "quantity": 4,
                "unit": "pieces"
            },
            {
                "name": "Tomato",
                "quantity": 3,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Oil",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Boil eggs",
                "description": "Hard boil the eggs, peel, and set aside."
            },
            {
                "title": "Make base",
                "description": "Sauté onions until brown, add pureed tomatoes and cook well."
            },
            {
                "title": "Add spices",
                "description": "Add spices and a little water to form a gravy."
            },
            {
                "title": "Combine",
                "description": "Add the boiled eggs into the gravy and simmer for 5 minutes."
            }
        ]
    },
    {
        "id": "recipe-tomato-sandwich",
        "title": "Tomato Sandwich",
        "description": "A super simple sandwich with fresh tomatoes.",
        "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "5",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Breakfast"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 2,
                "unit": "slices"
            },
            {
                "name": "Tomato",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Butter",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Prepare",
                "description": "Butter the bread slices."
            },
            {
                "title": "Slice",
                "description": "Slice the tomato into thick rounds."
            },
            {
                "title": "Assemble",
                "description": "Place tomatoes on bread, sprinkle salt and pepper, and close."
            }
        ]
    },
    {
        "id": "recipe-015",
        "title": "Paneer Butter Masala",
        "description": "Rich and creamy curry made with soft paneer cubes in a tomato gravy.",
        "image": "https://images.unsplash.com/photo-1631451095764-9facf6244435?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/U-s726-S-5w",
        "time": "40",
        "difficulty": "Medium",
        "servings": 4,
        "tags": [
            "Vegetarian",
            "Dinner"
        ],
        "ingredients": [
            {
                "name": "Paneer",
                "quantity": 250,
                "unit": "g"
            },
            {
                "name": "Tomato",
                "quantity": 4,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Butter",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Puree",
                "description": "Sauté onions and tomatoes, then blend into a smooth puree."
            },
            {
                "title": "Cook gravy",
                "description": "Melt butter, pour in puree, and simmer."
            },
            {
                "title": "Spices",
                "description": "Add spices and mix well."
            },
            {
                "title": "Add paneer",
                "description": "Add paneer cubes, simmer for 5 minutes, and serve."
            }
        ]
    },
    {
        "id": "recipe-016",
        "title": "Paneer Sandwich",
        "description": "A protein-packed sandwich with a spicy paneer filling.",
        "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "15",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Breakfast",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 2,
                "unit": "slices"
            },
            {
                "name": "Paneer",
                "quantity": 100,
                "unit": "g"
            },
            {
                "name": "Tomato",
                "quantity": 0.5,
                "unit": "piece"
            },
            {
                "name": "Butter",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Mash paneer",
                "description": "Crumble the paneer and mix with spices and chopped tomatoes."
            },
            {
                "title": "Layer",
                "description": "Spread the mixture between two slices of bread."
            },
            {
                "title": "Grill",
                "description": "Butter the outside and grill or toast in a pan until crisp."
            }
        ]
    },
    {
        "id": "recipe-017",
        "title": "Paneer Tikka",
        "description": "Marinated paneer cubes cooked to perfection.",
        "image": "https://images.unsplash.com/photo-1599487405270-86430b8e611b?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/rK2qP4XN_4w",
        "time": "30",
        "difficulty": "Medium",
        "servings": 3,
        "tags": [
            "Vegetarian",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Paneer",
                "quantity": 250,
                "unit": "g"
            },
            {
                "name": "Yogurt",
                "quantity": 3,
                "unit": "tbsp"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Oil",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Marinate",
                "description": "Mix yogurt with spices and coat cubed paneer and onions."
            },
            {
                "title": "Rest",
                "description": "Let it marinate for 20 minutes."
            },
            {
                "title": "Skewer",
                "description": "Thread paneer and onions onto skewers."
            },
            {
                "title": "Cook",
                "description": "Grill or pan-fry until charred on all sides."
            }
        ]
    },
    {
        "id": "recipe-paneer-rice",
        "title": "Paneer Rice",
        "description": "A quick and aromatic rice dish tossed with paneer cubes.",
        "image": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "25",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Lunch"
        ],
        "ingredients": [
            {
                "name": "Rice",
                "quantity": 1.5,
                "unit": "cups"
            },
            {
                "name": "Paneer",
                "quantity": 150,
                "unit": "g"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            }
        ],
        "steps": [
            {
                "title": "Cook rice",
                "description": "Boil rice and set aside."
            },
            {
                "title": "Sauté",
                "description": "Sauté onions and paneer cubes in oil until paneer is lightly browned."
            },
            {
                "title": "Mix",
                "description": "Mix in the cooked rice gently and serve hot."
            }
        ]
    },
    {
        "id": "recipe-018",
        "title": "Vegetable Fried Rice",
        "description": "A quick stir-fry using leftover rice and assorted vegetables.",
        "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/Xm1zU36mQ0k",
        "time": "20",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Dinner"
        ],
        "ingredients": [
            {
                "name": "Rice",
                "quantity": 2,
                "unit": "cups"
            },
            {
                "name": "Carrot",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Soy Sauce",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Chop veggies",
                "description": "Finely chop carrots and onions."
            },
            {
                "title": "Stir-fry",
                "description": "Stir-fry veggies in a hot wok."
            },
            {
                "title": "Add rice",
                "description": "Add cooked rice and soy sauce."
            },
            {
                "title": "Toss",
                "description": "Toss well on high heat for 2 minutes."
            }
        ]
    },
    {
        "id": "recipe-019",
        "title": "Egg Fried Rice",
        "description": "Classic fried rice with scrambled eggs.",
        "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "20",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Non-Vegetarian",
            "Dinner"
        ],
        "ingredients": [
            {
                "name": "Rice",
                "quantity": 2,
                "unit": "cups"
            },
            {
                "name": "Egg",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Oil",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Scramble egg",
                "description": "Quickly scramble the eggs in a hot wok and push to the side."
            },
            {
                "title": "Sauté",
                "description": "Add onions and sauté."
            },
            {
                "title": "Combine",
                "description": "Add rice, soy sauce, and mix everything together on high heat."
            }
        ]
    },
    {
        "id": "recipe-020",
        "title": "Lemon Rice",
        "description": "A tangy South Indian rice dish flavored with lemon and peanuts.",
        "image": "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "15",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Lunch"
        ],
        "ingredients": [
            {
                "name": "Rice",
                "quantity": 2,
                "unit": "cups"
            },
            {
                "name": "Lemon",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Oil",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Temper",
                "description": "Heat oil, add mustard seeds, curry leaves, and a pinch of turmeric."
            },
            {
                "title": "Mix",
                "description": "Add cooked rice and toss."
            },
            {
                "title": "Flavor",
                "description": "Turn off heat, squeeze fresh lemon juice, mix, and serve."
            }
        ]
    },
    {
        "id": "recipe-021",
        "title": "Omelette",
        "description": "A quick and protein-rich breakfast.",
        "image": "https://images.unsplash.com/photo-1510693061405-7f91cc44a673?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/s10etP1p2bU",
        "time": "10",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Non-Vegetarian",
            "Breakfast"
        ],
        "ingredients": [
            {
                "name": "Egg",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 0.5,
                "unit": "piece"
            },
            {
                "name": "Butter",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Beat",
                "description": "Beat eggs with salt, pepper, and finely chopped onion."
            },
            {
                "title": "Cook",
                "description": "Melt butter in a pan, pour in eggs, and cook until the bottom sets."
            },
            {
                "title": "Fold",
                "description": "Fold the omelette in half and serve."
            }
        ]
    },
    {
        "id": "recipe-023",
        "title": "Aloo Gobi",
        "description": "A dry Indian dish made with potatoes and cauliflower.",
        "image": "https://images.unsplash.com/photo-1631451095764-9facf6244435?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "35",
        "difficulty": "Medium",
        "servings": 3,
        "tags": [
            "Vegetarian",
            "Lunch"
        ],
        "ingredients": [
            {
                "name": "Potato",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Cauliflower",
                "quantity": 1,
                "unit": "head"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Oil",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Chop",
                "description": "Cut potatoes into cubes and cauliflower into florets."
            },
            {
                "title": "Sauté",
                "description": "Heat oil, sauté onions, then add potatoes and cauliflower."
            },
            {
                "title": "Cook",
                "description": "Cover and cook on low heat until tender."
            }
        ]
    },
    {
        "id": "recipe-024",
        "title": "Mashed Potatoes",
        "description": "Creamy, buttery mashed potatoes.",
        "image": "https://images.unsplash.com/photo-1518556608988-1eb24fb7bba3?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "https://www.youtube.com/embed/v9Z5vE5bTng",
        "time": "25",
        "difficulty": "Easy",
        "servings": 4,
        "tags": [
            "Vegetarian",
            "Dinner"
        ],
        "ingredients": [
            {
                "name": "Potato",
                "quantity": 4,
                "unit": "pieces"
            },
            {
                "name": "Milk",
                "quantity": 0.5,
                "unit": "cup"
            },
            {
                "name": "Butter",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Boil",
                "description": "Boil peeled potatoes until very soft."
            },
            {
                "title": "Mash",
                "description": "Drain and mash the potatoes until smooth."
            },
            {
                "title": "Mix",
                "description": "Stir in warm milk and butter until creamy. Season with salt."
            }
        ]
    },
    {
        "id": "recipe-025",
        "title": "Banana Smoothie",
        "description": "A healthy and filling drink.",
        "image": "https://images.unsplash.com/photo-1553530666-ba11a90a21d1?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "5",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Drinks"
        ],
        "ingredients": [
            {
                "name": "Banana",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Milk",
                "quantity": 1,
                "unit": "cup"
            },
            {
                "name": "Sugar",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Peel",
                "description": "Peel and roughly chop the banana."
            },
            {
                "title": "Blend",
                "description": "Blend banana, milk, and sugar until smooth."
            }
        ]
    },
    {
        "id": "recipe-026",
        "title": "Oats Porridge",
        "description": "A healthy breakfast bowl.",
        "image": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "10",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Breakfast"
        ],
        "ingredients": [
            {
                "name": "Oats",
                "quantity": 0.5,
                "unit": "cup"
            },
            {
                "name": "Milk",
                "quantity": 1,
                "unit": "cup"
            },
            {
                "name": "Banana",
                "quantity": 0.5,
                "unit": "piece"
            }
        ],
        "steps": [
            {
                "title": "Cook",
                "description": "Boil oats in milk for 5 minutes until thick."
            },
            {
                "title": "Top",
                "description": "Top with sliced bananas."
            }
        ]
    },
    {
        "id": "recipe-027",
        "title": "Onion Rings",
        "description": "Crispy fried onion rings.",
        "image": "https://images.unsplash.com/photo-1639596048123-5e921d227b72?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "20",
        "difficulty": "Medium",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Onion",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Flour",
                "quantity": 1,
                "unit": "cup"
            },
            {
                "name": "Oil",
                "quantity": 1,
                "unit": "cup"
            }
        ],
        "steps": [
            {
                "title": "Slice",
                "description": "Slice onions into thick rings."
            },
            {
                "title": "Batter",
                "description": "Dip rings in a batter made of flour, water, and spices."
            },
            {
                "title": "Fry",
                "description": "Deep fry until golden."
            }
        ]
    },
    {
        "id": "recipe-029",
        "title": "Potato Curry",
        "description": "Simple potato gravy for rice or roti.",
        "image": "https://images.unsplash.com/photo-1631451095764-9facf6244435?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "30",
        "difficulty": "Easy",
        "servings": 3,
        "tags": [
            "Vegetarian",
            "Dinner"
        ],
        "ingredients": [
            {
                "name": "Potato",
                "quantity": 3,
                "unit": "pieces"
            },
            {
                "name": "Tomato",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            }
        ],
        "steps": [
            {
                "title": "Base",
                "description": "Sauté chopped onions and tomatoes into a paste."
            },
            {
                "title": "Cook",
                "description": "Add diced potatoes, water, and simmer until cooked."
            }
        ]
    },
    {
        "id": "recipe-031",
        "title": "Bread Pudding",
        "description": "A sweet dessert baked with stale bread and milk.",
        "image": "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "45",
        "difficulty": "Medium",
        "servings": 4,
        "tags": [
            "Vegetarian",
            "Dessert"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 6,
                "unit": "slices"
            },
            {
                "name": "Milk",
                "quantity": 2,
                "unit": "cups"
            },
            {
                "name": "Sugar",
                "quantity": 3,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Tear",
                "description": "Tear bread into small pieces."
            },
            {
                "title": "Mix",
                "description": "Soak bread in milk and sugar mixture."
            },
            {
                "title": "Bake",
                "description": "Bake in an oven until set and golden."
            }
        ]
    },
    {
        "id": "recipe-033",
        "title": "Cheese Sandwich",
        "description": "A simple grilled cheese.",
        "image": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "10",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Bread",
                "quantity": 2,
                "unit": "slices"
            },
            {
                "name": "Cheese",
                "quantity": 2,
                "unit": "slices"
            },
            {
                "name": "Butter",
                "quantity": 1,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Layer",
                "description": "Place cheese between bread slices."
            },
            {
                "title": "Grill",
                "description": "Toast in a buttered pan until cheese melts."
            }
        ]
    },
    {
        "id": "recipe-034",
        "title": "Tomato Chutney",
        "description": "A tangy Indian dip.",
        "image": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "15",
        "difficulty": "Easy",
        "servings": 4,
        "tags": [
            "Vegetarian",
            "Sides"
        ],
        "ingredients": [
            {
                "name": "Tomato",
                "quantity": 4,
                "unit": "pieces"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Garlic",
                "quantity": 2,
                "unit": "cloves"
            }
        ],
        "steps": [
            {
                "title": "Sauté",
                "description": "Sauté chopped onion, garlic, and tomato until mushy."
            },
            {
                "title": "Blend",
                "description": "Cool and blend into a smooth paste."
            }
        ]
    },
    {
        "id": "recipe-035",
        "title": "Paneer Wrap",
        "description": "A quick wrap with a paneer filling.",
        "image": "https://images.unsplash.com/photo-1599487405270-86430b8e611b?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "20",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Lunch"
        ],
        "ingredients": [
            {
                "name": "Paneer",
                "quantity": 150,
                "unit": "g"
            },
            {
                "name": "Onion",
                "quantity": 1,
                "unit": "piece"
            },
            {
                "name": "Bread",
                "quantity": 2,
                "unit": "pieces"
            }
        ],
        "steps": [
            {
                "title": "Cook filling",
                "description": "Stir-fry paneer cubes and sliced onions with spices."
            },
            {
                "title": "Wrap",
                "description": "Place the filling inside flatbread and roll tightly."
            }
        ]
    },
    {
        "id": "recipe-037",
        "title": "Banana Pancakes",
        "description": "Fluffy pancakes made with mashed bananas.",
        "image": "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "20",
        "difficulty": "Easy",
        "servings": 2,
        "tags": [
            "Vegetarian",
            "Breakfast"
        ],
        "ingredients": [
            {
                "name": "Banana",
                "quantity": 2,
                "unit": "pieces"
            },
            {
                "name": "Flour",
                "quantity": 1,
                "unit": "cup"
            },
            {
                "name": "Milk",
                "quantity": 0.5,
                "unit": "cup"
            }
        ],
        "steps": [
            {
                "title": "Mash",
                "description": "Mash bananas and mix with flour and milk."
            },
            {
                "title": "Cook",
                "description": "Pour batter onto a hot pan and flip when bubbly."
            }
        ]
    },
    {
        "id": "recipe-038",
        "title": "Chocolate Milkshake",
        "description": "A rich chocolate drink.",
        "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "5",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Drinks"
        ],
        "ingredients": [
            {
                "name": "Chocolate",
                "quantity": 50,
                "unit": "g"
            },
            {
                "name": "Milk",
                "quantity": 1,
                "unit": "cup"
            }
        ],
        "steps": [
            {
                "title": "Melt",
                "description": "Melt the chocolate slightly."
            },
            {
                "title": "Blend",
                "description": "Blend melted chocolate with cold milk until frothy."
            }
        ]
    },
    {
        "id": "recipe-039",
        "title": "Potato Cutlet",
        "description": "Crispy pan-fried potato patties.",
        "image": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "30",
        "difficulty": "Medium",
        "servings": 3,
        "tags": [
            "Vegetarian",
            "Snack"
        ],
        "ingredients": [
            {
                "name": "Potato",
                "quantity": 3,
                "unit": "pieces"
            },
            {
                "name": "Bread",
                "quantity": 1,
                "unit": "slice"
            },
            {
                "name": "Oil",
                "quantity": 2,
                "unit": "tbsp"
            }
        ],
        "steps": [
            {
                "title": "Mash",
                "description": "Mash boiled potatoes and mix with crumbled bread."
            },
            {
                "title": "Shape",
                "description": "Form into flat round patties."
            },
            {
                "title": "Fry",
                "description": "Pan-fry on both sides until golden brown."
            }
        ]
    },
    {
        "id": "recipe-040",
        "title": "Cold Coffee",
        "description": "A refreshing iced coffee drink.",
        "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
        "videoUrl": "",
        "time": "5",
        "difficulty": "Easy",
        "servings": 1,
        "tags": [
            "Vegetarian",
            "Drinks"
        ],
        "ingredients": [
            {
                "name": "Milk",
                "quantity": 1,
                "unit": "cup"
            },
            {
                "name": "Sugar",
                "quantity": 1,
                "unit": "tbsp"
            },
            {
                "name": "Coffee",
                "quantity": 1,
                "unit": "tsp"
            }
        ],
        "steps": [
            {
                "title": "Blend",
                "description": "Blend cold milk, sugar, and coffee powder with ice."
            }
        ]
    }
];

const mockImpact = {
    itemsConsumed: 124,
    foodSavedLbs: 45.2,
    recipesCooked: 38,
    moneySaved: 180
};

// Make available globally
window.BhojData = {
    pantry: mockPantry,
    recipes: mockRecipes,
    impact: mockImpact
};
