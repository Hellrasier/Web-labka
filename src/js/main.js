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
        this.age = this.age+1
    },
    changeSurname: function(new_sur) {
        this.surname = new_sur
    },
    changeName: function(new_nam) {
        this.name = new_nam
    },
    moveToNextCourse: function() {
        this.course = this.course+1
    },
    changeGroup: function(grp) {
        this.group = grp
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
    for(key in student) {
        if (key == "getOlder") return 
        var selector = modal2.querySelector('#' + key)
        selector.children[1].innerText = student[key]
    }
}

form.onsubmit = function() {
    createStudent(form.querySelector('#name-surname').value.split(' ')[0],
    form.querySelector('#name-surname').value.split(' ')[1],
    form.querySelector('#age').value,
    form.querySelector('#course').value,
    form.querySelector('#group').value)
    modal.classList.remove('visible')
    modal2.classList.add('visible')
    displayStudent()
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

function plusOne(elem) {
    var number = parseInt(elem.parentNode.children[1].innerText) + 1
    elem.parentNode.children[1].innerText = number
}

// for(let inp of form.querySelectorAll('input')) {
//     inp.addEventListener('focusout', checkInput)
// }

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

