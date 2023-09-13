//Selecionar elementos
const noteToPutInput = document.querySelector('#note-to-put')
const putNoteBtn = document.querySelector('#put-note-btn')
const notesSection = document.querySelector('#notes-section')

//Funções
function insertNote(content, fixed = false, save = 1){
   
   
   const divNote = document.createElement('div')
   divNote.classList.add('note')

   const divHeaderNote = document.createElement('div')
   divHeaderNote.classList.add('header-note')

   const tagPPhrase = document.createElement('p')
   tagPPhrase.innerHTML = content

   const divHideIcons = document.createElement('div')
   divHideIcons.classList.add('hide-icons')

   const closeBtn = document.createElement('button')
   closeBtn.classList.add('close-btn')
   closeBtn.innerHTML = '<iconify-icon icon="line-md:close"></iconify-icon>'

   const copyBtn = document.createElement('button')
   copyBtn.classList.add('copy-btn')
   copyBtn.innerHTML = '<iconify-icon icon="line-md:text-box-to-text-box-multiple-transition"></iconify-icon>'

   const pinBtn = document.createElement('button')
   pinBtn.classList.add('pin')
   pinBtn.innerHTML = '<iconify-icon icon="lucide:pin"></iconify-icon>'


    if(fixed){
        divNote.classList.add('fixed')
    }
    if(save){
        saveNotesLocalStorage({content, fixed})
    }
    
   notesSection.appendChild(divNote)
   divNote.appendChild(divHeaderNote)
   divNote.appendChild(pinBtn)
   divHeaderNote.appendChild(tagPPhrase)
   divHeaderNote.appendChild(divHideIcons)
   divHideIcons.appendChild(closeBtn)
   divHideIcons.appendChild(copyBtn)

}
function clean(){
    noteToPutInput.value = ''
}
// function copy(divNote){

// }
function fixing(fixDiv){
    fixDiv.classList.toggle('fixed')
}
function cleanNotes(){
    notesSection.replaceChildren([])
}
//Eventos
putNoteBtn.addEventListener("click", (e) => {
    e.preventDefault()

    const noteToPutInputValue = noteToPutInput.value;
    if(!noteToPutInputValue) return;

    insertNote(noteToPutInputValue)
    clean()
})

noteToPutInput.addEventListener('keyup', (e) => {
    e.preventDefault()
    if(e.key == 'Enter'){
        const noteToPutInputValue = noteToPutInput.value;
        if(!noteToPutInputValue) return;

        insertNote(noteToPutInputValue)
        clean()
    }
})
document.addEventListener("click", (e) => {
    const targetElement = e.target
    const parentElement = targetElement.closest('.note')

    console.log(targetElement)
    console.log(parentElement)

    if(targetElement.classList.contains('close-btn')){
        parentElement.remove()
        removeNoteLocalStorage(parentElement.querySelector('.header-note p').innerHTML)
    }
    // if(targetElement.classList.contains('copy-btn')){
    //     copy(parentElement)
        
    // }
    if(targetElement.classList.contains('pin')){
        fixing(parentElement)
        putFixedNoteLocalStorage(parentElement.querySelector('.header-note p').innerHTML)
        cleanNotes()
        loadNotes()
    }
    
})
// local storage
const saveNotesLocalStorage = (objNote) => {
    const notes = getNotesLocalStorage()

    notes.push(objNote)

    localStorage.setItem('Notes', JSON.stringify(notes))
}

const getNotesLocalStorage = () => {
    const notes = JSON.parse(localStorage.getItem('Notes')) || []

    const orderedNotesByFixed = notes.sort((a,b) => (a.fixed > b.fixed ? -1 : 1))

    return orderedNotesByFixed
}

function loadNotes() {
    const notes = getNotesLocalStorage()

    notes.forEach((note) => {
        insertNote(note.content, note.fixed, 0)
    })
}
const removeNoteLocalStorage = (noteText) => {
    const notes = getNotesLocalStorage()

    const filteredNotes = notes.filter((note) => note.content !== noteText)

    localStorage.setItem('Notes', JSON.stringify(filteredNotes))
}
const putFixedNoteLocalStorage = (noteText) => {
    
    const notes = getNotesLocalStorage()

    notes.map((note) => note.content === noteText ? note.fixed = !note.fixed : null)

    localStorage.setItem('Notes', JSON.stringify(notes))
}

loadNotes()
