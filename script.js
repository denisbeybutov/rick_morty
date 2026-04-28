// https://rickandmortyapi.com/api/character/?name=
const personListElement = document.querySelector('.person-list');
const navigationPage = document.querySelector('.navigation__page');
const nextButton = document.querySelector('.navigation__next');
const prevButton = document.querySelector('.navigation__prev');

async function getPersonList(namePerson) {
    const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${namePerson}`);
    const person = await response.json();    
    return person;
}

function showPersonElements(person){
    

    const personElement = document.createElement('div');
    personElement.classList.add('person-card')
    personElement.innerHTML = `
                                <img class='size' src="${person.image}">
                                <p>${person.name}</p>

                              `
    personListElement.append(personElement);

    


}

function showPage(currentPage, personList) {
    personListElement.innerHTML = '';
    personList.results.forEach(showPersonElements);
    navigationPage.innerHTML = `Страница ${currentPage} из ${personList.info.pages}`;
}

async function showPersonList(event) {        
    // вводит имя персонажа
    const person = event.target.value;
    // зарос по имени персонажа, получаем объект 
    const personList = await getPersonList(person);
    console.log(personList);
 
    //текущая страница
    let currentPage = 1;
    let currentPageLink = personList;
    // показать текущую страницу по полученному в начале объекту
    showPage(currentPage, personList);

    // нажимаем на кнопку вперед и показываем следующую страницу
    nextButton.addEventListener('click', async () => {

        // проверяем текущая страница существует
        if(currentPage < personList.info.pages) {
            
            // делаем запрос по полю next по ссылке в текущей странице 
            const nextResponse = await fetch(`${currentPageLink.info.next}`);
            const nextList = await nextResponse.json();
            console.log(nextList)

            // прибавляем счетчик страниц
            currentPage++;
        
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
            
            // делаем запрос по полю next по ссылке в текущей странице 
            const prevResponse = await fetch(`${currentPageLink.info.prev}`);
            const prevList = await prevResponse.json();
            console.log(prevList)

            // прибавляем счетчик страниц
            currentPage--;
        
            // показываем следующую страницу
            showPage(currentPage, prevList)
            // меняем ссылку на текущую страницу
            currentPageLink = prevList;
        }
        else return;
        
    })
}

 

// входная точка
document.querySelector('#search__input').addEventListener('change', showPersonList)
