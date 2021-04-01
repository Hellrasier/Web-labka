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
    if(input.value == '') return
    else if (!input.value.match(reg)) printError(input)
    else printSucces(input)
    
}

var student = {
    name: '',
    surname: '',
    age: 0,
    course: 0,
    group: '**-**',
    getOlder: function() {
        this.age = parseInt(this.age)+1
        updateStudent().then(data => console.log(data))
    },
    changeSurname: function(new_sur) {
        this.surname = new_sur
        updateStudent().then(data => console.log(data))
    },
    changeName: function(new_nam) {
        this.name = new_nam
        updateStudent().then(data => console.log(data))
    },
    moveToNextCourse: function() {
        this.course = parseInt(this.course)+1
        updateStudent().then(data => console.log(data))
    },
    changeGroup: function(grp) {
        this.group = grp
        updateStudent().then(data => console.log(data))
    }
}   

function createStudent(name, surname, age, course, group) {
    student.name = name
    student.surname = surname
    student.age = age
    student.course = course
    student.group = group
}

function displayStudent() {
    for(let key in student) {
        console.dir(student)
        if (key == "getOlder") return 
        var selector = modal2.querySelector('#' + key)
        selector.children[1].innerText = student[key]
    }
}

function postStudent() {
    var http = new XMLHttpRequest()
    http.open('POST', '/api/student/')
    http.send(JSON.stringify(student))
    http.onload = function() {
        console.log(`Request status ${http.status}: ${http.statusText}; response: ${http.response}`)
    }
    http.onerror = function() {
        alert("Error couldn't make a request")
    }
}

function getStudent() {
    var http = new XMLHttpRequest()
    http.open('GET', '/api/student/')
    http.send()
    http.onload = function() {
        console.log(`Request status ${http.status}: ${http.statusText}; response: ${http.response}`)
        student = {...student, ...JSON.parse(http.response)}
        console.log(student)
        displayStudent()
    }
    http.onerror = function() {
        alert("Error couldn't make a request")
    }
}

async function updateStudent() {
   return fetch('/api/student', {
        headers: { 
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(student)
    }).then(response => response.json())
}

form.onsubmit = function() {
    createStudent(form.querySelector('#name-surname').value.split(' ')[0],
    form.querySelector('#name-surname').value.split(' ')[1],
    form.querySelector('#age').value,
    form.querySelector('#course').value,
    form.querySelector('#group').value)
    modal.classList.remove('visible')
    modal2.classList.add('visible')
    postStudent()
    return false
}

function revealInput(elem) {
    elem.classList.add('n-vis')
    elem.parentNode.children[3].classList.remove('n-vis')
}

function hideInput(elem) {
    elem.classList.add('n-vis')
    elem.parentNode.children[2].classList.remove('n-vis')
}

function inputName(elem) {
    var name = elem.parentNode.children[3].value
    elem.parentNode.children[1].innerText = name
    student.changeName(name)
}

function inputSurname(elem) {
    var name = elem.parentNode.children[3].value
    elem.parentNode.children[1].innerText = name
    student.changeSurname(name)
}

function inputGroup(elem) {
    var name = elem.parentNode.children[3].value
    elem.parentNode.children[1].innerText = name
    student.changeGroup(name)
}

function plusOne(elem, method) {
    var number = parseInt(elem.parentNode.children[1].innerText) + 1
    elem.parentNode.children[1].innerText = number
    student[method]()
}

$('.modal-form').validate({
    onfocusout: checkInput
})


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

