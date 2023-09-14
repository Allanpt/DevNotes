//Selecionar elementos
const noteToPutInput = document.querySelector('#note-to-put')
const putNoteBtn = document.querySelector('#put-note-btn')
const notesSection = document.querySelector('#notes-section')
const searchInput = document.querySelector('#search-input')
const exportBtn = document.querySelector('#export-btn')
const bodySwitch = document.querySelector('body')
const modeSpanSwitch = document.querySelector('#mode')

//Funções
function insertNote(content, fixed = false, save = 1, id){
   
   let noteId = id
   if(save){
        noteId = generateNewIDIfExist(id)
   } 
   

   const divNote = document.createElement('div')
   divNote.classList.add('note')
   divNote.classList.add(noteId)

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
        saveNotesLocalStorage({content,fixed,noteId})
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
function generateId(){
    return Math.floor(Math.random() * 5000)
}

function copy(divNote){
    const contentDivNote = divNote.querySelector('.header-note p').innerHTML

    let fixedDivNote = false
    if(divNote.classList.contains('fixed')){
        fixedDivNote = true
    }
    insertNote(contentDivNote, fixedDivNote, id = generateId())
}
function fixing(fixDiv){
    fixDiv.classList.toggle('fixed')
}
function cleanNotes(){
    notesSection.replaceChildren([])
}
function getSearchNotes(value){

    const notes = document.querySelectorAll('.note')
    notes.forEach((note) =>{

        let noteTitle = note.querySelector('.header-note p').innerHTML.toLowerCase()

        note.style.display = 'flex'

        if(!noteTitle.includes(value.toLowerCase())){
            note.style.display = 'none'
        }

    })
}

//Eventos
modeSpanSwitch.addEventListener('click', () =>{
    bodySwitch.classList.toggle('dark-mode')
})
putNoteBtn.addEventListener("click", (e) => {
    e.preventDefault()

    const noteToPutInputValue = noteToPutInput.value;
    if(!noteToPutInputValue) return;
    
    insertNote(noteToPutInputValue,undefined, undefined,id = generateId())
    clean()
})

noteToPutInput.addEventListener('keyup', (e) => {
    e.preventDefault()
    if(e.key == 'Enter'){
        const noteToPutInputValue = noteToPutInput.value;
        if(!noteToPutInputValue) return;

        insertNote(noteToPutInputValue,undefined,undefined, id = generateId())
        clean()
    }
})
searchInput.addEventListener("keyup", (e) =>{
    const fieldSearchValue = e.target.value
    getSearchNotes(fieldSearchValue)
})

document.addEventListener("click", (e) => {
    const targetElement = e.target
    const parentElement = targetElement.closest('.note')
    
    if(targetElement.classList.contains('close-btn')){
        parentElement.remove()
        removeNoteLocalStorage(parentElement.querySelector('.header-note p').innerHTML)
    }
    if(targetElement.classList.contains('copy-btn')){
        copy(parentElement)
        cleanNotes()
        loadNotes()
    }
    if(targetElement.classList.contains('pin')){
        fixing(parentElement)
        console.log(parentElement.classList[1])
        putFixedNoteLocalStorage(parentElement.classList[1])
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

        insertNote(note.content, note.fixed, 0, note.noteId)
    })
}
const removeNoteLocalStorage = (noteText) => {
    const notes = getNotesLocalStorage()

    const filteredNotes = notes.filter((note) => note.content !== noteText)

    localStorage.setItem('Notes', JSON.stringify(filteredNotes))
}
const putFixedNoteLocalStorage = (noteid) => {
    const notes = getNotesLocalStorage();

    notes.forEach((note) => {
        if (note.noteId == noteid) {
            note.fixed = !note.fixed;
        }
    });

    localStorage.setItem('Notes', JSON.stringify(notes));
}
function generateNewIDIfExist(id){
    const notes = getNotesLocalStorage()

    let filteredIds = notes.filter((note) => note.id === id)[0]
    while(filteredIds !== undefined){
        id = generateId()
        filteredIds = notes.filter((note) => note.id === id)[0]
        
    }
    return id
}
//inicialização
loadNotes()

//Download
function exportData(){
    const notes = getNotesLocalStorage()

    const csvString = [
        ['ID', 'Conteudo', 'Fixado?'],...notes.map((note) => [note.noteId, note.content, note.fixed])]
        .map((e) => e.join(','))
        .join('\n')
    
    const element = document.createElement('a')

    element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString)

    element.target = '_blank'

    element.download = 'notes.csv'

    element.click()
}
exportBtn.addEventListener('click', () =>{
    exportData()
})