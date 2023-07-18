

// ### List Books

// When the page loads, get a list of books from `http://localhost:3000/books` and
// display their titles by creating a `li` for each book and adding each `li` to
// the `ul#list` element.
const titleList = document.querySelector("#list");
const displayPanel = document.querySelector('#show-panel')


fetch(`http://localhost:3000/books`)
    .then(resp => resp.json())
    .then(data => {
        data.forEach(bookObject => {
            const newLi = document.createElement("li");
            newLi.addEventListener('click', () => {
                displayDetails(bookObject);
            })
            newLi.textContent = bookObject.title;
            titleList.appendChild(newLi);
        });
    })


// ### Show Details

// When a user clicks the title of a book, display the book's thumbnail, description,
// and a list of users who have liked the book. This information should be displayed in
// the `div#show-panel` element.
function displayDetails(bookObject) {
    const img = document.createElement('img');
    img.src = bookObject.img_url;

    const title = document.createElement('h1');
    title.textContent = bookObject.title;

    const subtitle = document.createElement('h1');
    subtitle.textContent = bookObject.subtitle;

    const author = document.createElement('h1');
    author.textContent = bookObject.author;

    const description = document.createElement('p');
    description.textContent = bookObject.description;

    const likeContainer = document.createElement('ul');
    bookObject.users.forEach(userObject => {
        const li = document.createElement("li");
        li.textContent = userObject.username;
        likeContainer.appendChild(li);
    })

    const likeButton = document.createElement("button");
    likeButton.textContent = "Like";
    let userLikesBook = false;
    likeButton.addEventListener("click", (e) => {
        if (userLikesBook) {
            // if user likes book remove from db
            const OPTIONS = {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    users: [...bookObject.users.slice(0,-1)],
                })
            }
            fetch(`http://localhost:3000/books/` + bookObject.id, OPTIONS)
            .then(resp => resp.json())
            .then(data => {
                e.target.textContent = "Like";
                userLikesBook = false;
                likeContainer.removeChild(likeContainer.lastChild);


            })
            
        } else {
            // Patch like count to db; Rerender page with new count.
            const OPTIONS = {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    users: [...bookObject.users, { id: 11, username: "Sally" }]
                })
            }
            fetch(`http://localhost:3000/books/` + bookObject.id, OPTIONS)
                .then(resp => resp.json())
                .then(data => {
                    const newUser = document.createElement('li');
                    const username = data.users.slice(-1)[0].username;
                    newUser.textContent = username;
                    likeContainer.appendChild(newUser);
                    e.target.textContent = "Unlike";
                    userLikesBook = true;
                })
            
            
        }


    })


    const bookDiv = document.createElement('div');
    bookDiv.append(img, title, subtitle, author, description, likeContainer, likeButton);

    if (displayPanel.hasChildNodes) {
        displayPanel.replaceChildren(bookDiv)
    } else {
        displayPanel.append(bookDiv);
    }

}


// ### Like a Book

// A user can like a book by clicking on a button. Display a `LIKE` button along
// with the book details. When the button is clicked, send a `PATCH` request to
// `http://localhost:3000/books/:id` with an array of users who like the book,
// and add a new user to the list.

// For example, if you are user 1 `{"id":1, "username":"pouros"}` and the previous
// array was `"[{"id":2, "username":"auer"}, {"id":8, "username":"maverick"}]`, you
// should send as the body of your PATCH request:


