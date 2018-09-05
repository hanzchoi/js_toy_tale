// fetch all the toys
// fetch from database to populate out toy list

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  const toyCollection = document.querySelector('#toy-collection')
  let addToy = false

  // fetch toy list
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(data => {
      data.forEach( toy => {
        let toyDiv = toyCard(toy)
        toyCollection.appendChild(toyDiv)
      })
    })

  // add a new toy!
  // send post request to update database
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let toyNameInput = document.querySelector('input[name="name"]')
    let toyImageInput = document.querySelector('input[name="image"]')

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: toyNameInput.value,
        image: toyImageInput.value,
        likes: 0
      })
    })
      .then(response => response.json())
      .then(data => toyCollection.appendChild(toyCard(data)))
    toyNameInput.value = ''
    toyImageInput.value = ''
  })

  // add liking feature
  toyCollection.addEventListener('click', (event) => {
    if (event.target.classList.contains('like-btn')) {
      let parent = event.target.parentNode
      let toyLikes = parent.querySelector('.toy-likes')
      fetch(`http://localhost:3000/toys/${parent.getAttribute('data-id')}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          likes: parseInt(toyLikes.innerText) + 1
        })
      }).then(response => response.json())
        .then(data => toyLikes.innerText = data.likes)
    }
  })

  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
      // submit listener here
    } else {
      toyForm.style.display = 'none'
    }
  })
})

function toyCard(toy) {
  let toyCard = document.createElement('div')
  toyCard.classList.add('card')
  toyCard.setAttribute('data-id', toy.id)
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src='${toy.image}' class='toy-avatar'>
    <p>
      <span class='toy-likes'>  ${toy.likes}  </span>     Likes</p>
    <button class='like-btn'>Like <3</button>
  `
  return toyCard
}


// OR HERE!
