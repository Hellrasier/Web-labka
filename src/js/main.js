var modal = document.getElementById("modal")
var modal2 = document.getElementById("modal2")
var form = document.querySelector('.modal-form')

document.getElementById('sign').onclick = function() {
    modal.classList.add('visible')
    startTimer()
}

document.getElementById('cross').onclick = function(){
    modal.classList.remove('visible')
}


document.getElementById('student').onclick = function(){
    modal2.classList.add('visible')
}

document.getElementById('cross2').onclick = function(){
    modal2.classList.remove('visible')
}

document.getElementById('str-test').onclick = function(){
    modal3.classList.add('visible')
}

document.getElementById('cross3').onclick = function(){
    modal3.classList.remove('visible')
}

addEventListener('mouseup', function(e){  
    [modal, modal2, modal3].forEach((modal, index, arr) => {
        var modal_block = modal.querySelector('.modal-block')
        if(!modal_block.isSameNode(e.target) && !modal_block.contains(e.target)) {
            arr[index].classList.remove('visible')
        }
})
})

function startTimer() {
    setTimeout(() => {
    var labels = form.querySelectorAll('label')
    for (var label of labels) {
        var input = label.querySelector('input')
        if ( input.value == '') {
            let text = label.querySelector('span')
            input.placeholder = "Enter some " + text.innerText + " info here"
    }
}
}, 20000);
}

function printError(el){
    el.nextSibling.nextSibling.innerText = "*Error incorrect form input"
}

function printSucces(el) {
    el.nextSibling.nextSibling.innerText = ""
}

function checkInput(element) {
    var input = element.target == undefined ? element : element.target
    var reg = new RegExp(input.getAttribute('pattern'))
    if(input.value == '') return false
    else if (!input.value.match(reg)) {
        printError(input)
        return false
    } else {
        printSucces(input)
        return true
    }
    
}

var user = {
    name: '',
    surname: '',
    age: 0,
    getOlder: function() {
        this.age = parseInt(this.age)+1
        updateStudent(this).then(data => console.log(data))
    },
    changeSurname: function(new_sur) {
        this.surname = new_sur
        updateStudent(this).then(data => console.log(data))
    },
    changeName: function(new_nam) {
        this.name = new_nam
        updateStudent(this).then(data => console.log(data))
    }
}

var student = {
    __proto__: user,
    course: 0,
    group: '**-**',
    faculty: '',
    moveToNextCourse: function() {
        this.course = parseInt(this.course)+1
        updateStudent().then(data => console.log(data))
    },
    changeGroup: function(grp) {
        this.group = grp
        updateStudent().then(data => console.log(data))
    },
    changeFaculty: function(faculty) {
        this.faculty = faculty
        updateStudent().then(data => console.log(data))
    }
}   

function createStudent(name_surname, age, course, group, faculty) {
    let stud = {}
    stud.__proto__ = student
    stud.name = name_surname.split(' ')[0]
    stud.surname = name_surname.split(' ')[1]
    stud.age = age
    stud.course = course
    stud.group = group
    stud.faculty = faculty
    return stud
}

function displayStudents(studList) {
    let students_display = document.querySelector('#student_display')
    students_display.innerHTML = ''
    studList.forEach(([id, {name, surname, age, course, group, faculty}]) => {
        stud = createStudent(name + " " + surname, age, course, group, faculty)
        stud.id = id
        students_display.innerHTML = students_display.innerHTML + `<div class="field" id="id">
        <span class="key">Id:</span>
        <span class="info">${stud.id}</span>
        </div>
    <div class="field" id="name">
        <span class="key">Name:</span>
        <span class="info">${stud.name}</span>
    </div>
    <div class="field" id="surname">
        <span class="key">Surname:</span>
        <span class="info">${stud.surname}</span>
    </div>
    <div class="field" id="age">
        <span class="key">Age:</span>
        <span class="info">${stud.age}</span>
    </div>
    <div class="field" id="course">
        <span class="key">Course:</span>
        <span class="info">${stud.course}</span>
    </div>
    <div class="field" id="group">
        <span class="key">Group:</span>
        <span class="info">${stud.group}</span>
    </div>
    <div class="field" id="faculty">
        <span class="key">Faculty:</span>
        <span class="info">${stud.faculty}</span>
    </div>
    <br>`
        
    })
    // for(let key in student) {
    //     console.dir(student)
    //     if (key == "getOlder") return 
    //     var selector = modal2.querySelector('#' + key)
    //     selector.children[1].innerText = student[key]
    // }
}

function postStudent(stud) {
    var http = new XMLHttpRequest()
    http.open('POST', '/api/student/')
    http.send(JSON.stringify(stud))
    http.onload = function() {
        console.log(`Request status ${http.status}: ${http.statusText}; response: ${http.response}`)
    }
    http.onerror = function() {
        alert("Error couldn't make a request")
    }
}

function getStudents() {
    var http = new XMLHttpRequest()
    http.open('GET', '/api/student/')
    http.send()
    http.onload = function() {
        console.log(`Request status ${http.status}: ${http.statusText}; response: ${http.response}`)
        studentsList = JSON.parse(http.response)
        console.log(`Sudlist: ${studentsList}`)
        displayStudents(studentsList)
    }
    http.onerror = function() {
        alert("Error couldn't make a request")
    }
}

async function updateStudent(stud) {
    console.log(stud)
   return fetch('/api/student', {
        headers: { 
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(stud)
    }).then(response => response.json())
}

form.onsubmit = function(e) {
    e.preventDefault()
    const inputs = [form.querySelector('#name-surname'),
    form.querySelector('#age'),
    form.querySelector('#course'),
    form.querySelector('#group'),
    form.querySelector('#faculty')]
    if (inputs.every(checkInput)){
        let values = inputs.map(input => input.value)
        modal.classList.remove('visible')
        modal2.classList.add('visible')
        postStudent(createStudent(...values))
        getStudents()
    }
    return false
}

// function revealInput(elem) {
//     elem.classList.add('n-vis')
//     elem.parentNode.children[3].classList.remove('n-vis')
// }

// function hideInput(elem) {
//     elem.classList.add('n-vis')
//     elem.parentNode.children[2].classList.remove('n-vis')
// }

// function inputName(elem) {
//     var name = elem.parentNode.children[3].value
//     elem.parentNode.children[1].innerText = name
//     student.changeName(name)
// }

// function inputSurname(elem) {
//     var name = elem.parentNode.children[3].value
//     elem.parentNode.children[1].innerText = name
//     student.changeSurname(name)
// }

// function inputGroup(elem) {
//     var name = elem.parentNode.children[3].value
//     elem.parentNode.children[1].innerText = name
//     student.changeGroup(name)
// }

// function inputFaculty(elem) {
//     var name = elem.parentNode.children[3].value
//     elem.parentNode.children[1].innerText = name
//     student.changeFaculty(name)
// }

// function plusOne(elem, method) {
//     var number = parseInt(elem.parentNode.children[1].innerText) + 1
//     elem.parentNode.children[1].innerText = number
//     let id = parseInt(elem.parentNode.parentNode.querySelector('#id').querySelector('.info').innerText)
//     console.log(`id: ${id}`)
//     student[method]()
// }

// // $('.modal-form').validate({
// //     onfocusout: checkInput
// // })


function checkString(text) {
    text = text.split(', ')
    text = [text[0]].concat(text[1].split(' '))
    var result = true;
    for (i = 0; i < text.length - 1; i++){
        for (j = 1; j < text[i].length; j++)
        if (text[i][j] == text[i][j].toUpperCase()) result = false
    }
    for (j = 0; j < text[2].length; j++) {
        if (text[2][j] == text[2][j].toLowerCase()) result = false
    }
    return result
}

function doCheck(elem) {
    var res = checkString(elem.value)
    elem.nextSibling.nextSibling.innerText = res.toString()
    if(res) {
        elem.nextSibling.nextSibling.classList.add('true')
        elem.nextSibling.nextSibling.classList.remove('false') 
    } else {
        elem.nextSibling.nextSibling.classList.remove('true')
        elem.nextSibling.nextSibling.classList.add('false')
    }
}

