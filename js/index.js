// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const minWeight = document.querySelector('.minweight__input');
const maxWeight = document.querySelector('.maxweight__input');
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

//вызов соответствующего цвету класса CSS
function colorToClass(color) {
  switch (color) {
    case 'фиолетовый': return 'fruit_violet';
    case 'зеленый': return 'fruit_green';
    case 'розово-красный': return 'fruit_carmazin';
    case 'желтый': return 'fruit_yellow';
    case 'светло-коричневый': return 'fruit_lightbrown'
  }
}

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.innerHTML = "";

  for (let i = 0; i < fruits.length; i++) {

    const colorClass = colorToClass(fruits[i].color)
    let newLi = document.createElement('li');
    newLi.className = `fruit__item ${colorClass}`;

    newLi.innerHTML = `<div class="fruit__info">
                        <div>index: ${i}</div>
                        <div>kind: ${fruits[i].kind}</div>
                        <div>color: ${fruits[i].color}</div>
                        <div>weight (кг): ${fruits[i].weight}</div>
                      </div>`

    fruitsList.append(newLi);

  }

};

// первая отрисовка карточек
display();


/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    const i = getRandomInt(0, fruits.length - 1)
    result.push(fruits[i]);
    fruits.splice(i, 1);
  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((item) => {
    return (item.weight >= minWeight.value) && (item.weight <= maxWeight.value)
  });
  console.log(fruits);
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {

  const stringToCode = (str) => {
    let code = "";
    [...str].forEach(char => {
      code += char.charCodeAt(0);
    });
    return parseInt(code);
  };

  const codeA = stringToCode(a);
  const codeB = stringToCode(b);

  if (codeB < codeA) return true;

};

const sortAPI = {
  bubbleSort(arr, comparation) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1; j++) {
        const a = arr[j].color;
        const b = arr[j + 1].color;

        if (comparation(a, b)) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
  },

  quickSort(arr) {

    const n = arr.length;

    if (n < 2) {
      return arr;
    }

    const pivot = arr[Math.floor(n / 2)].color;

    let left = [], center = [], right = [];

    arr.forEach(el => {
      if(el.color == pivot){center.push(el)}
      else if ((el.color != pivot) && (el.color.length>=pivot.length)){right.push(el)}
      else if ((el.color != pivot) && (el.color.length<pivot.length)){left.push(el)}
    });

    return fruits = [...sortAPI.quickSort(left), ...center, ...sortAPI.quickSort(right)]

  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  if (sortKind == 'bubbleSort') {
    sortKindLabel.innerText = 'quickSort';
    sortKind = 'quickSort';
  }
  else {
    sortKindLabel.innerText = 'bubbleSort';
    sortKind = 'bubbleSort';
  }

});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.innerText = 'Sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.innerText = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // if ((kindInput.value == "") || (weightInput.value == "")){
  //   
  //   return false;

  // }

  let fruit = {
    kind: kindInput.value,
    color: colorInput.value,
    weight: weightInput.value
  }
  fruits.push(fruit);
  display();
});
