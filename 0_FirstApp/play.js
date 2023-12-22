//Constante
const myname = 'Lan';
//Variable
let thisisbool = true;
console.log(myname);
console.log(thisisbool);

const summarizeUser = (userName, userBool) => {
    return ('Name is ' + userName + ' ' + userBool);
};

const addRandom = () => 1+2;

console.log(summarizeUser(myname,thisisbool));

const person = {
    name: 'Lan',
    age: 24,
    greet(){
        console.log('Hi, I am ' + this.name);
    }
}

//Recibe el objeto entero, pero solo tiene en cuenta el valor de la variable name
const printName = ({name}) => {
    console.log(name);
}

//Tienen que tener el mismo nombre que la clase
const {name, age} = person;
console.log(name, age);

printName(person);

console.log(person);
person.greet();

const hobbies = ['Sports', 'Cooking'];
//No tienen pq tener el mismo nombre
const [hobby1, hobby2] = hobbies;
console.log(hobby1);
console.log(hobby2);
for (let hobby of hobbies){
    console.log(hobby);
}

console.log(hobbies.map(hobby => {
    return 'Hobby: ' + hobby;
}));

//Spread operator
const copiedArray = [...hobbies];

//Rest operator
const toArray = (...args) => {
    return args
}
console.log(toArray(1,2,3,4));

//Promesa
const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        //Asigna valor a cuando se resuelve la promesa de forma satisfactoria
        resolve('Done!');
      }, 1500);
    });
    return promise;
  };
  
  setTimeout(() => {
    console.log('Timer is done!');
    //.then() se usa despues de una promesa
    fetchData()
      .then(text => {
        console.log(text);
        return fetchData();
      })
      //Hace referencia al return de la linea anterior
      .then(text2 => {
        console.log(text2);
      });
  }, 2000);