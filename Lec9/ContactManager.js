class ContactManager {
    constructor() {
        this.contacts = []; 
    }

       addNewContact(name, phone, email) {
        
        for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].email === email) {
                console.log(`შეცდომა: კონტაქტი იმეილით [${email}] უკვე არსებობს!`);
                return false;
            }
            if (this.contacts[i].phone === phone) {
                console.log(`შეცდომა: კონტაქტი ნომრით [${phone}] უკვე არსებობს!`);
                return false;
            }
        }

        let newContact = { name: name, phone: phone, email: email };
        this.contacts.push(newContact);
        return true;
    }


    viewAllContacts() {
        return this.contacts;
    }


    updatePhone(email, newPhone) {
            for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].phone === newPhone) {
                console.log(`შეცდომა: ნომერი [${newPhone}] უკვე დაკავებულია სხვა კონტაქტის მიერ!`);
                return false;
            }
        }

        for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].email === email) {
                this.contacts[i].phone = newPhone;
                return true;
            }
        }
        console.log("კონტაქტი მოცემული იმეილით ვერ მოიძებნა.");
        return false;
    }

    deleteContact(email) {
        let index = -1;
        for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].email === email) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            this.contacts.splice(index, 1);
            return true;
        }
        return false;
    }
}

console.log("*** CONTACT MANAGER ***");
const manager = new ContactManager();

const c1 = manager.addNewContact("გიორგი", "599111222", "gio@gmail.com");
const c2 = manager.addNewContact("ნინო", "599333444", "nino@gmail.com");
console.log("წარმატებით დაემატა პირველი :", c1);
console.log("წარმატებით დაემატა მეორე :", c2);

console.log("\n--- ვალიდაციის შემოწმება : ---");
const c3 = manager.addNewContact("ალეკო", "599555666", "gio@gmail.com"); 
console.log("დუბლიკატი იმეილით დამატება :", c3);

const c4 = manager.addNewContact("ლაშა", "599111222", "lasha@gmail.com"); 
console.log("დუბლიკატი ნომრით დამატება :", c4);
console.log("------------------------------------------------------------------\n");

console.log("ტელეფონის განახლება :", manager.updatePhone("nino@gmail.com", "599888888"));

console.log("\n--- ნომრის განახლების ვალიდაცია: ---");
const badUpdate = manager.updatePhone("nino@gmail.com", "599111222"); 
console.log("სხვის ნომერზე შეცვლის მცდელობა :", badUpdate);
console.log("-----------------------------------------------------\n");

manager.deleteContact("gio@gmail.com");
console.log("გიორგის წაშლის შემდეგ კონტაქტების რაოდენობა :", manager.viewAllContacts().length);
console.log("=========================================");