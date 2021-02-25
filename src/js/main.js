var modal = document.getElementById("modal")

document.getElementById('sign').addEventListener('click', function() {
    modal.classList.add('visible')
})

document.getElementById('cross').addEventListener('click', function(){
    modal.classList.remove('visible')
})

addEventListener('mouseup', function(e){
    var modal_block = document.getElementById('md-block')   
    if(!modal_block.isSameNode(e.target) && !modal_block.contains(e.target)) {
        modal.classList.remove('visible')
    }
})

