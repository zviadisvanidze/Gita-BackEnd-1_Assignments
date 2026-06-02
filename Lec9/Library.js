class Library {
    constructor() {
        this.books = []; 
    }
    addBook(book) {
        this.books.push(book);
    }

    removeBook(title) {
        let index = -1;
        for (let i = 0; i < this.books.length; i++) {
            if (this.books[i].title === title) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }

    listBooks(sortBy) {
        let booksCopy = [];
        for (let i = 0; i < this.books.length; i++) {
            booksCopy.push(this.books[i]);
        }

        if (sortBy === 'year') {
            for (let i = 0; i < booksCopy.length; i++) {
                for (let j = 0; j < booksCopy.length - 1; j++) {
                    if (booksCopy[j].year > booksCopy[j + 1].year) {
                        let temp = booksCopy[j];
                        booksCopy[j] = booksCopy[j + 1];
                        booksCopy[j + 1] = temp;
                    }
                }
            }
        }
        return booksCopy;
    }
}

console.log("*** LIBRARY ***");
const myLibrary = new Library();

myLibrary.addBook({ title: "ვეფხისტყაოსანი", author: "შოთა რუსთაველი", year: 1200 });
myLibrary.addBook({ title: "დონ კიხოტი", author: "სერვანტესი", year: 1605 });
myLibrary.addBook({ title: "დათა თუთაშხია", author: "ჭაბუა ამირეჯიბი", year: 1973 });

console.log("ყველა წიგნის რაოდენობა:", myLibrary.listBooks().length);

const sortedBooks = myLibrary.listBooks('year');
console.log("სორტირებული წიგნების წლები:");
for (let i = 0; i < sortedBooks.length; i++) {
    console.log(`${sortedBooks[i].title} (${sortedBooks[i].year})`);
}

myLibrary.removeBook("დონ კიხოტი");
console.log("წაშლის შემდეგ დარჩენილი რაოდენობა:", myLibrary.listBooks().length);
console.log("-------------------------------------------");