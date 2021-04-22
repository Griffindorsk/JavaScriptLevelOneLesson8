// Задание #1
let declarationBlock = document.getElementById('declaration');
let declaration = document.createElement('div');
declaration.innerHTML = '<h3>Задание #1</h3><p>Работа с товарами и корзиной</p><br>';
declarationBlock.appendChild(declaration);
console.log('Задание #1');

//исходные данные для автоматической генерации каталога
let sizesAvailable = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
let colorsAvailable = ['aquamarine', 'cadetblue', 'darkcyan', 'goldenrod', 'hotpink', 'indianred', 'khaki', 'lawngreen', 'maroon'];
let gendersAvailable = ['M', 'F', 'Unisex'];
let basicPriceRange = [100, 500];
let purchasingPriceRange = [30, 50];
let productsCatalogue = [];

// заполняем тестовый каталог
let generationButton = document.getElementById('generation_button');
generationButton.onclick = findTheNumber;

let newBasket = {};

newBasket = {
    products: [],
    totalSum: function () {
        let totalSumData = 0;
        for (let i = 0; i < this.products.length; i++) {
            totalSumData = totalSumData + this.products[i].цена * this.products[i].количество;
        }
        return totalSumData;
    },
    cleanBasket: function () {
        this.products = [];
    }
}

function findTheNumber() { //вызов функции заполнения каталога после ввода кол-ва позиций
    let generationInput = document.getElementById('generation_value');
    productsCatalogue = catalogueFulfillment(generationInput.value);
    printTheCatalogue(productsCatalogue);
    return productsCatalogue;
}

// функция автоматического заполнения тестового каталога товаров
function catalogueFulfillment(numberOfProducts) {
    productsCatalogue = [];
    newBasket.cleanBasket();
    printTheBasket(newBasket);
    for (i = 0; i < numberOfProducts; i++) {
        // модель товарной позиции в каталоге, включая метод расчета цены с учетом скидки
        productsCatalogue[i] = {
            'артикул': 'id_' + i,
            'раздел': 'одежда',
            'группа': 'футболки',
            'бренд': 'йо-хо-хо',
            'пол': gendersAvailable[Math.floor(Math.random() * (gendersAvailable.length))],
            'размер': sizesAvailable[Math.floor(Math.random() * (sizesAvailable.length))],
            'цвет': colorsAvailable[Math.floor(Math.random() * (colorsAvailable.length))],
            'цена': basicPriceRange[0] + Math.floor(Math.random() * (basicPriceRange[1] - basicPriceRange[0] + Number(1))),
            'закупка': purchasingPriceRange[0] + Math.floor(Math.random() * (purchasingPriceRange[1] - purchasingPriceRange[0] + Number(1))),
        }
    }
    return productsCatalogue;
}
function printTheCatalogue(arrayOfObjects) {
    let placement = document.getElementById('catalogue_content');
    placement.innerHTML = '';
    let k = 0;
    let columnName;
    for (let key in arrayOfObjects[0]) {
        k = k + +1;
        if ((key != 'закупка') && (key != 'finalPrice')) {
            columnName = document.createElement('div');
            columnName.innerHTML = '<h4>' + key + '</h4>';
            columnName.style.gridArea = '1 / ' + k;
            placement.appendChild(columnName);
        }
    }
    let product;
    let featureValue;
    let productFeature;
    let productButton;
    for (i = 0; i < arrayOfObjects.length; i++) { // перебор товаров
        let j = +2 + i;
        k = 0;
        for (let key in arrayOfObjects[i]) { // перебор свойств товара
            // console.log(key);
            if ((key != 'закупка') && (key != 'finalPrice')) {
                k = k + +1;
                product = arrayOfObjects[i];
                featureValue = product[key];
                productFeature = document.createElement('div');
                productFeature.innerHTML = '<p>' + featureValue + '</p>';
                productFeature.style.gridArea = j + ' / ' + k;
                placement.appendChild(productFeature);
            }
        }
        k = k + +1;
        productButton = document.createElement('div');
        productButton.type = 'submit';
        productButton.className = 'roundButton';
        productButton.innerHTML = 'в&nbsp;корзину';
        productButton.style.gridArea = j + ' / ' + k;
        productButton.onclick = addToBasket.bind(i);
        placement.appendChild(productButton);
    }
}
function printTheBasket(arrayOfObjects) {
    let placement = document.getElementById('basket_content');
    placement.innerHTML = '';
    let k = 0;
    let columnName;
    for (let key in arrayOfObjects.products[0]) {
        k = k + +1;
        columnName = document.createElement('div');
        columnName.innerHTML = '<h4>' + key + '</h4>';
        columnName.style.gridArea = '1 / ' + k;
        placement.appendChild(columnName);
    }
    let product;
    let featureValue;
    let productFeature;
    let productButton;
    for (i = 0; i < arrayOfObjects.products.length; i++) { // перебор товаров
        let j = +2 + i;
        k = 0;
        for (let key in arrayOfObjects.products[i]) { // перебор свойств товара
            // console.log(key);
            k = k + +1;
            product = arrayOfObjects.products[i];
            featureValue = product[key];
            productFeature = document.createElement('div');
            productFeature.innerHTML = '<p>' + featureValue + '</p>';
            productFeature.style.gridArea = j + ' / ' + k;
            placement.appendChild(productFeature);
        }
        k = k + +1;
    }
    let sumPlacement = document.getElementsByClassName('basket_total_sum');
    sumPlacement[0].innerHTML = '<p>Заказано товаров на сумму: ' + newBasket.totalSum() + ' руб.</p>';
}

function addToBasket() {

    let basketObject = {
        'артикул': productsCatalogue[this].артикул,
        'группа': productsCatalogue[this].группа,
        'бренд': productsCatalogue[this].бренд,
        'пол': productsCatalogue[this].пол,
        'размер': productsCatalogue[this].размер,
        'цвет': productsCatalogue[this].цвет,
        'цена': productsCatalogue[this].цена,
        'количество': 1
    }
    // Проверка, есть ли уже такой товар в корзине. Если есть, то изменяется количество.
    if (newBasket.products.length == 0) {
        newBasket.products.push(basketObject);
        console.log('артикул корзины 0-го элемента' + newBasket.products[0].артикул);
    } else {
        let i = 0;
        let repeatFound = false;
        let currentBasketLength = newBasket.products.length;
        while ((i < currentBasketLength) && (repeatFound == false)) {
            if (newBasket.products[i].артикул == basketObject.артикул) {
                basketObject.количество = newBasket.products[i].количество + +1;
                newBasket.products.splice(i, 1, basketObject);
                repeatFound = true;
            }
            i += 1;
        }
        if (repeatFound == false) {
            newBasket.products.push(basketObject);
        }
    }
    printTheBasket(newBasket);
}