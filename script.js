const inputElement = document.querySelector('#search__input');
const personListElement = document.querySelector('.person-list');
const navigationPage = document.querySelector('.navigation__page');
const nextButton = document.querySelector('.navigation__next');
const prevButton = document.querySelector('.navigation__prev');
const loader = document.querySelector('.loader');
const errorElement = document.querySelector('.error');
const personInformation = document.querySelector('.person-information');

async function getPersonList(namePerson) {
    try{
        const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${namePerson}`);
        
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const person = await response.json();    
        return person;
    }
    catch (error) {        
        if(error.message.includes('404')) {
            
            errorElement.innerHTML = 'Нет результатов, введите другое имя';
        }
        else {
            
            errorElement.innerHTML = 'Другая ошибка';
        }
    }
   
}

function showPersonElements(person){
    

    const personElement = document.createElement('div');
    personElement.classList.add('person-card')
    personElement.setAttribute('data-person-card', true);
    personElement.innerHTML = `
                                <img class="size" src="${person.image}">
                                <p>${person.name}</p>

                              `
    personListElement.append(personElement);

    


}

function showPage(currentPage, personList) {
    personListElement.innerHTML = '';
    personInformation.innerHTML = '';
    personList.results.forEach(showPersonElements);
    navigationPage.innerHTML = `Страница ${currentPage} из ${personList.info.pages}`;
}

function showLoader() {
    loader.innerHTML = 'Загрузка...';
    personListElement.innerHTML = '';
}

function hideLoader(){
    loader.innerHTML = '';
}

async function showPersonList(event) {        
    // показываем лоадер
    showLoader();
    errorElement.innerHTML = '';
    // вводит имя персонажа
    const person = event.target.value;
    // зарос по имени персонажа, получаем объект 
    const personList = await getPersonList(person);
    
    //текущая страница
    let currentPage = 1;
    let currentPageLink = personList;
    // убираем лоадер
    hideLoader();
    // показать текущую страницу по полученному в начале объекту
    showPage(currentPage, personList);
    
    //отслеживаем клик по карточкам
    personListElement.addEventListener('click', (event) => {
        let card;
        if(event.target.dataset.personCard){            
            card = event.target;            
        } else if( event.target.parentElement.dataset.personCard) {            
            card = event.target.parentElement;
        }
        
        const nameOfPerson = card.lastElementChild.textContent;
        let [out] = currentPageLink.results.filter(result => result.name === nameOfPerson);
        personInformation.innerHTML = `<pre>${JSON.stringify(out, null, 2)}</pre>`;

    });

    // нажимаем на кнопку вперед и показываем следующую страницу
    nextButton.addEventListener('click', async () => {

        // проверяем текущая страница существует
        if(currentPage < personList.info.pages) {

            showLoader();
            // делаем запрос по полю next по ссылке в текущей странице 
            const nextResponse = await fetch(`${currentPageLink.info.next}`);
            const nextList = await nextResponse.json();
            

            // прибавляем счетчик страниц
            currentPage++;
            
            hideLoader();
            // показываем следующую страницу
            showPage(currentPage, nextList)
            // меняем ссылку на текущую страницу
            currentPageLink = nextList;
        }
        else return;
        
    })
    // нажимаем на кнопку назад и показываем предыдущую страницу
    prevButton.addEventListener('click', async () => {

        // проверяем текущая страница существует
        if(currentPage > 1) {
            
            showLoader();
            // делаем запрос по полю next по ссылке в текущей странице 
            const prevResponse = await fetch(`${currentPageLink.info.prev}`);
            const prevList = await prevResponse.json();            

            // прибавляем счетчик страниц
            currentPage--;
        
            hideLoader();
            // показываем следующую страницу
            showPage(currentPage, prevList)
            // меняем ссылку на текущую страницу
            currentPageLink = prevList;
        }
        else return;
        
    })
}

// входная точка
inputElement.addEventListener('input', showPersonList);

