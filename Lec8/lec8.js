console.log("Lec8 - ასინქრონული ოპერაციები და Promise-ები");

// 1) დაწერეთ ფუნცქია რომელიც დალოგავს მაუსის კოორდინატებს მხოლოდ მას შემდეგ რაც მაუსი 
// გაჩერდება, გამოიყენეთ debaunce ტექნიკა. მინიშნება: 
// window.addEventListener('mousemove',(e) => { console.log(e.clientX, e.clientY) })

function debounce(callback, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback.apply(this, args);
        }, delay);
    };
}

function logMousePosition(e) {
    console.log(`მაუსი გაჩერდა! კოორდინატები: X: ${e.clientX}, Y: ${e.clientY}`);
}

const debouncedLog = debounce(logMousePosition, 400);
window.addEventListener('mousemove', debouncedLog);


//2) შექმენით html-ში ბათონი და ყოველ ბათონის ქლიქზე დაარექუესთეთ შემდეგი API-დან და
//  მიღებული შედეგი გამოაჩნიეთ https://dummyjson.com/quotes ისევე როგორც რენდომ კატის ფაქტზე ვქენით.

const button = document.getElementById('get-quote-btn');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');


        async function getRandomQuote() {
            const url = "https://dummyjson.com/quotes";
                
                quoteText.textContent = "იტვირთება...";
                quoteAuthor.textContent = "";

                const response = await fetch(url);
               
                const data = await response.json();
                const quotesArray = data.quotes;

                const randomIndex = Math.floor(Math.random() * quotesArray.length);
                const randomQuote = quotesArray[randomIndex];

                quoteText.textContent = `"${randomQuote.quote}"`;
                quoteAuthor.textContent = `— ${randomQuote.author}`;

        }
        button.addEventListener('click', getRandomQuote);


// 3) დაწერეთ ფუნცქია რომელიც წამოიღებს იუზერების ინფორმაციას შემდეგი API-დან https://dummyjson.com/users 
// თქვენი მიზანია გააკეთოთ ფეჯინეიშენი სულ არის 200-ზე მეტი იუზერი და დიფოტად მოდის 30. მინიშნება, 
// თუ სრულ რაოდენობას გაყოფთ ლიმიტზე მიიღებთ ფეიჯების რაოდენობას, რაც შეეხება როგორ უნდა გამოთვალოთ
//  skip ფროფერთი. skip = (page - 1) * limit) limit = 30

async function getUsersByPage(page = 1, limit = 30) {
    const skip = (page - 1) * limit;

    const url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`სერვერის შეცდომა: ${response.status}`);
        }

        const data = await response.json();

        const totalUsers = data.total; 
  
        const totalPages = Math.ceil(totalUsers / limit);

        console.log(`--- გვერდი ${page} / ${totalPages}-დან ---`);
        console.log(`ნაჩვენებია იუზერები: ${skip + 1}-დან ${skip + data.users.length}-მდე`);
        console.log("მიმდინარე გვერდის იუზერები:", data.users);
        
        return data.users;

    } catch (error) {
        console.error("შეცდომა ფეჯინეიშენისას:", error.message);
    }
}


getUsersByPage(1);

setTimeout(() => getUsersByPage(2), 1500);


//4) შექმენით ინფუთი სადაც იუზერი მხოლოდ რიცხვებს შეიყვანს, რიცხვის შეყვანის შემდეგ 
// უნდა დაარექუესთოთ შემდეგ ეიპიაიზე https://myfakeapi.com/api/cars/10 10-ის ნაცვლად 
// ჩაწერეთ იუზერის შეყვანილი ინფომრაცია, ეს ეიპიაი დაგიბრუნებთ მანქანის ინფორმაციას და 
// გამოაჩინეტ ეს ინფორმაცია დომში. ასევე თუ არასწორი აიდი დაწერა მაგალითად 9999 ბექენდი
//  დაგირტყავთ ერორს და გაჰენდლეთ ერორი და უთხარით იუზერს რომ სწორი აიდი შეიყვანოს,
//  მაგალითად alert ის გამოყენებით.

document.getElementById('search-btn').addEventListener('click', async () => {
        const carId = document.getElementById('car-id-input').value;
        const detailsContainer = document.getElementById('car-details');
        
        if (!carId) {
            alert('გთხოვთ, შეიყვანოთ ID!');
            return;
        }

        try {
            const response = await fetch(`https://myfakeapi.com/api/cars/${carId}`);

            if (!response.ok) {
                throw new Error('მანქანა ვერ მოიძებნა');
            }

            const data = await response.json();

            const car = data.Car;
            detailsContainer.innerHTML = `
                <h3>${car.car} ${car.car_model}</h3>
                <p><strong>წელი:</strong> ${car.car_model_year}</p>
                <p><strong>ფერი:</strong> ${car.car_color}</p>
                <p><strong>ფასი:</strong> ${car.price}</p>
                <p><strong>VIN:</strong> ${car.car_vin}</p>
                <p><strong>ხელმისაწვდომობა:</strong> ${car.availability ? 'კი' : 'არა'}</p>
            `;
            detailsContainer.style.display = 'block'; 

        } catch (error) {

            alert('შეცდომა: შეიყვანე სწორი ID!');
            detailsContainer.style.display = 'none'; 
            console.error(error);
        }
    });