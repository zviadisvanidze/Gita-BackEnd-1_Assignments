const fs = require('fs');

const FILE_NAME = 'cars.json';
const args = process.argv.slice(2);

function readCars() {
  try {
    const data = fs.readFileSync(FILE_NAME, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveCars(cars) {
  fs.writeFileSync(FILE_NAME, JSON.stringify(cars, null, 2), 'utf-8');
}


if (args[0] === 'show') {
  const filterValue = args[1]; 
  
  if (!filterValue) {
    console.log(' მიუთითოთ წელი ან ფერი. მაგალითად: node car.js show 2020');
    process.exit(1);
  }

  const cars = readCars();
  console.log(`--- ფილტრი: ${filterValue} ---`);
  
  let found = false;
  for (let i = 0; i < cars.length; i++) {
    
    if (cars[i].carReleaseDate === filterValue || cars[i].carColor.toLowerCase() === filterValue.toLowerCase()) {
      console.log(`მანქანა: ${cars[i].carName}, ფერი: ${cars[i].carColor}, წელი: ${cars[i].carReleaseDate}`);
      found = true;
    }
  }

  if (!found) {
    console.log('შესაბამისი მანქანა ვერ მოიძებნა.');
  }

} else {

  const carName = args[0];
  const carReleaseDate = args[1];
  const carColor = args[2];

  if (!carName || !carReleaseDate || !carColor) {
    console.log(' შეიყვანე მონაცემები სწორად: node car.js [სახელი] [წელი] [ფერი]');
    process.exit(1);
  }

  const cars = readCars();
  
  cars.push({
    carName: carName,
    carColor: carColor,
    carReleaseDate: carReleaseDate
  });

  saveCars(cars);
  console.log(`მანქანა ${carName} წარმატებით დაემატა.`);
}