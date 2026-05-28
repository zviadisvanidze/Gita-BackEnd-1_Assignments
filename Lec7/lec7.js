// 1) დაწერეთ ფუნქცია რომელიც წამოიღებს დეითას ამ საიტიდან https://jsonplaceholde.typicode.com, 
// url სპეციალურად არის არასწორი თქვენი მიზანია რომ როდესაც რექუსთი დაფეილდება გააკეთოთ რეთრაი 5 ჯერ. 
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, retries = 5, delayMs = 1000) {
    for (let i = 1; i <= retries; i++) {
        try {
            console.log(`მცდელობა #${i}...`);
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`სერვერის შეცდომა: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
            
        } catch (error) {
            console.warn(`მცდელობა #${i} ჩავარდა. მიზეზი: ${error.message}`);
            if (i === retries) {
                throw new Error(`ფუნქციამ ვერ შეძლო მონაცემების წამოღება ${retries} მცდელობის შემდეგ.`);
            }
            await delay(delayMs);
        }
    }
}
const incorrectUrl = "https://jsonplaceholde.typicode.com/posts/1"; 
fetchWithRetry(incorrectUrl)
    .then(data => console.log("წარმატება:", data))
    .catch(error => console.error("საბოლოო შეცდომა:", error.message));


// 2) დაწერეთ ფუნცქია რომელიც წამოიღებს მონაცემებს ამ ორი url-დან https://dummyjson.com/users და 
// https://jsonplaceholder.typicode.com/users თქვენი მიზანია დალოგოთ მხოლოდ ის რომელიც მოასწრებს დარიზოლვებას.

async function logFastestRequestAsync() {
    const url1 = "https://dummyjson.com/users";
    const url2 = "https://jsonplaceholder.typicode.com/users";

    const fastestResponse = await Promise.race([
        fetch(url1),
        fetch(url2)
    ]).catch(error => {
        console.error("ქსელის შეცდომა რბოლისას:", error.message);
    });
   
    if (!fastestResponse) return;

    if (!fastestResponse.ok) {
        console.error(`სერვერის შეცდომა: ${fastestResponse.status}`);
        return;
    }

    const data = await fastestResponse.json().catch(error => {
        console.error("JSON-ის პარსინგის შეცდომა:", error.message);
    });

    if (data) {
        console.log("გამარჯვებული URL:", fastestResponse.url);
        console.log("მონაცემები:", data);
    }
}
logFastestRequestAsync();

// 3) დაწერეთ ფუნქცია რომელიც წამოიღებს ინფორმაციას https://dummyjson.com/products ამ url-დან, 
// შემდეგ გაფილტავას და დალოგავს მხოლოდ იმ პროდუქტებს რომელთა ფასიც არის 10-ზე მეტი

async function getExpensiveProducts() {
    const url = "https://dummyjson.com/products";

        const response = await fetch(url); 
        const data = await response.json();
        const allProducts = data.products;
        const filteredProducts = allProducts.filter(product => product.price > 10);
        console.log("--- 10$-ზე ძვირი პროდუქტები ---");
        console.log(filteredProducts);
        console.log(`სულ ნაპოვნია: ${filteredProducts.length} პროდუქტი.`);
}

getExpensiveProducts();

//4) დაწერეთ ფუნქცია რომელიც წამოიღებს ინფორმაციას ამ url-დან https://dummyjson.com/users, 
// გაფილტრავს მხოლოდ ისეთ იუზერებს რომელთა პროფესია არის web developer და დალოგავს 
// მხოლოდ შემდეგ ფროფერთებს: სახელი, გვარი, მისამართი(ქალაქი), იმეილი და ტელეფონის ნომერი.

async function getWebDevelopers() {
    const url = "https://dummyjson.com/users";

        const response = await fetch(url);
        const data = await response.json();
        const allUsers = data.users;
        const webDevelopers = allUsers.filter(user => 
            user.company && user.company.title === "Web Developer"
        );
        const formattedUsers = webDevelopers.map(user => {
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                city: user.address 
            };
        });

        console.log("--- ნაპოვნი Web Developer-ები ---");
        console.log(formattedUsers);
        console.log(`სულ ნაპოვნია: ${formattedUsers.length}`);

   }

getWebDevelopers();

//  5) დაწერეთ ფუნქცია რომელიც წამოიღებს იმფორმაციას ერთდროულად შემდეგი  api-დან:
//  https://dummyjson.com/recipes, https://dummyjson.com/comments, https://dummyjson.com/todos, 
// https://dummyjson.com/quotes და ყველას დარიზოლვებულ და ჯეისონში გადმოტრანსფორმირებულ
//  შედეგებს დალოგავთ. აუცილებელია რომ ყველა გაეშვას ერთდროულად

async function fetchAllDataParallel() {
    const urls = [
        "https://dummyjson.com/recipes",
        "https://dummyjson.com/comments",
        "https://dummyjson.com/todos",
        "https://dummyjson.com/quotes"
    ];

        console.log("მოთხოვნები გაეშვა პარალელურად...");
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const dataResults = await Promise.all(responses.map(res => res.json()));
        const [recipesData, commentsData, todosData, quotesData] = dataResults;
        console.log("--- ყველა მონაცემი წარმატებით წამოვიდა! ---");
        console.log("რეცეპტები:", recipesData.recipes);
        console.log("კომენტარები:", commentsData.comments);
        console.log("თუდუები (Todos):", todosData.todos);
        console.log("ციტატები:", quotesData.quotes);
}

fetchAllDataParallel();