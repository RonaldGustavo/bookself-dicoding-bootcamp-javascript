const incompleteBookshelfListEl = document.getElementById(
  "incompleteBookshelfList"
);
const completeBookshelfListEl = document.getElementById(
  "completeBookshelfList"
);

// input
const inputTitle = document.getElementById("inputBookTitle");
const inputAuthor = document.getElementById("inputBookAuthor");
const inputYear = document.getElementById("inputBookYear");
const inputIsComplete = document.getElementById("inputBookIsComplete");

// button
const btnSubmit = document.getElementById("bookSubmit");

const getBooksFromLocalStorage = (key) => {
  const books = localStorage.getItem(key);
  return books ? JSON.parse(books) : [];
};

// data awal
let dataBookNotReadFromLocal = getBooksFromLocalStorage("notReadBooks");
let dataBookReadFromLocal = getBooksFromLocalStorage("readBooks");

const renderBook = (book, container, type) => {
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.dataset.bookId = book.id;

  const titleEl = document.createElement("h3");
  titleEl.classList.add(`${type}_book_title`);
  titleEl.innerText = book.title;

  const idEl = document.createElement("p");
  idEl.classList.add(`${type}_book_id`);
  idEl.innerText = `id: ${book.id}`;

  const authorEl = document.createElement("p");
  authorEl.classList.add(`${type}_book_author`);
  authorEl.innerText = `Penulis: ${book.author}`;

  const yearEl = document.createElement("p");
  yearEl.classList.add(`${type}_book_year`);
  yearEl.innerText = `Tahun: ${book.year}`;

  const actionEl = document.createElement("div");
  actionEl.classList.add("action");

  bookItem.appendChild(actionEl);

  const btnReadEl = document.createElement("button");
  btnReadEl.classList.add("green", "btn_read");
  btnReadEl.innerText = book.isComplete ? "Not Read" : "Read";

  const btnDeleteEl = document.createElement("button");
  btnDeleteEl.classList.add("red", "btn_delete");
  btnDeleteEl.innerText = `Delete`;

  actionEl.appendChild(btnReadEl);
  actionEl.appendChild(btnDeleteEl);

  bookItem.appendChild(titleEl);
  bookItem.appendChild(idEl);
  bookItem.appendChild(authorEl);
  bookItem.appendChild(yearEl);
  bookItem.appendChild(actionEl);

  // add to container
  container.appendChild(bookItem);
};

const renderBooks = () => {
  dataBookNotReadFromLocal.forEach((book) => {
    renderBook(book, incompleteBookshelfListEl, "read");
  });

  dataBookReadFromLocal.forEach((book) => {
    console.log("data:", book);
    renderBook(book, completeBookshelfListEl, "notread");
  });
};
// render awal
renderBooks();

// delete
const deleteBook = (btnDeleteEl, data, type, key) => {
  const container = btnDeleteEl.parentElement.parentElement;
  const idToDelete = parseInt(container.dataset.bookId);

  const indexToDelete = data.findIndex((book) => book.id === idToDelete);
  if (indexToDelete !== -1) {
    data.splice(indexToDelete, 1);
    saveBooksToLocalStorage(key, data);
  }

  container.remove();
};

const callListener = () => {
  const btnDeleteElements = document.querySelectorAll(".btn_delete");

  btnDeleteElements.forEach((btnDeleteEl) => {
    console.log(btnDeleteEl);
    btnDeleteEl.addEventListener("click", () => {
      const container = btnDeleteEl.parentElement.parentElement;
      const isComplete = container.parentElement === completeBookshelfListEl;

      if (isComplete) {
        deleteBook(btnDeleteEl, dataBookReadFromLocal, "read", "readBooks");
      } else {
        deleteBook(
          btnDeleteEl,
          dataBookNotReadFromLocal,
          "notread",
          "notReadBooks"
        );
      }
    });
  });
  const btnReadElements = document.querySelectorAll(".btn_read");

  // move
  const moveBook = (
    bookId,
    sourceData,
    targetData,
    sourceContainer,
    targetContainer
  ) => {
    const bookToMove = sourceData.find((book) => book.id === bookId);

    if (bookToMove) {
      const isBookInTarget = targetData.some(
        (book) => book.id === bookToMove.id
      );

      if (!isBookInTarget) {
        targetData.push(bookToMove);

        const bookIndex = sourceData.findIndex((book) => book.id === bookId);
        sourceData.splice(bookIndex, 1);

        const bookElement = sourceContainer.querySelector(
          `[data-book-id="${bookId}"]`
        );

        if (bookElement) {
          sourceContainer.removeChild(bookElement);

          renderBook(
            bookToMove,
            targetContainer,
            bookToMove.isComplete ? "read" : "notread"
          );

          saveBooksToLocalStorage("readBooks", dataBookReadFromLocal);
          saveBooksToLocalStorage("notReadBooks", dataBookNotReadFromLocal);
        }
      }
    }
  };

  btnReadElements.forEach((btnReadEl) => {
    btnReadEl.addEventListener("click", () => {
      const bookId = parseInt(
        btnReadEl.parentElement.parentElement.dataset.bookId
      );
      const isComplete =
        btnReadEl.parentElement.parentElement.parentElement ===
        completeBookshelfListEl;

      const bookToMove = isComplete
        ? dataBookReadFromLocal.find((book) => book.id === bookId)
        : dataBookNotReadFromLocal.find((book) => book.id === bookId);

      if (bookToMove) {
        if (isComplete) {
          moveBook(
            bookId,
            dataBookReadFromLocal,
            dataBookNotReadFromLocal,
            completeBookshelfListEl,
            incompleteBookshelfListEl
          );
          bookToMove.isComplete = false;
        } else {
          moveBook(
            bookId,
            dataBookNotReadFromLocal,
            dataBookReadFromLocal,
            incompleteBookshelfListEl,
            completeBookshelfListEl
          );
          bookToMove.isComplete = true;
        }

        saveBooksToLocalStorage("readBooks", dataBookReadFromLocal);
        saveBooksToLocalStorage("notReadBooks", dataBookNotReadFromLocal);
      }
      window.location.reload();
    });
  });
};

callListener();

// btn submit
btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();

  //   get Value input
  const titleValue = inputTitle.value;
  const authorValue = inputAuthor.value;
  const yearValue = inputYear.value;
  const isCompleteValue = inputIsComplete.checked;

  // generate unique id
  const idBook = Math.floor(Math.random() * 900) + new Date().getTime();

  const newBook = {
    id: idBook,
    title: titleValue,
    author: authorValue,
    year: parseInt(yearValue),
    isComplete: isCompleteValue,
  };

  // form required
  if (newBook.title && newBook.year && newBook.author) {
    if (newBook.isComplete) {
      renderBook(newBook, completeBookshelfListEl, "read");
      console.log("data book completed");
      dataBookReadFromLocal.push(newBook);
    } else {
      renderBook(newBook, incompleteBookshelfListEl, "notread");

      dataBookNotReadFromLocal.push(newBook);
    }
  } else {
    alert("Field wajib di isi semua!!");
  }

  saveBooksToLocalStorage("readBooks", dataBookReadFromLocal);
  saveBooksToLocalStorage("notReadBooks", dataBookNotReadFromLocal);

  // test check jumlah data array
  console.log("data Book Read:", dataBookReadFromLocal);
  console.log("data Book Not Read", dataBookNotReadFromLocal);

  // Reset value form
  handleClearForm();

  callListener();
});

const handleClearForm = () => {
  inputTitle.value = "";
  inputAuthor.value = "";
  inputYear.value = "";
  inputIsComplete.checked = false;
};

const saveBooksToLocalStorage = (key, books) => {
  localStorage.setItem(key, JSON.stringify(books));
};

//search
const inputSearch = document.getElementById("searchBookTitle");
const searchBooks = (searchTerm) => {
  const filteredNotReadBooks = dataBookNotReadFromLocal.filter((book) => {
    return book.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredReadBooks = dataBookReadFromLocal.filter((book) => {
    return book.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  incompleteBookshelfListEl.innerHTML = "";
  completeBookshelfListEl.innerHTML = "";

  filteredNotReadBooks.forEach((book) => {
    renderBook(book, incompleteBookshelfListEl, "read");
  });

  filteredReadBooks.forEach((book) => {
    renderBook(book, completeBookshelfListEl, "notread");
  });
};

const btnFindEl = document.querySelector(".btn_find");

btnFindEl.addEventListener("click", (event) => {
  event.preventDefault();
  const searchTerm = inputSearch.value;
  searchBooks(searchTerm);
  callListener();
  inputSearch.value = "";
});

//reset
const btnReset = document.querySelector(".btn_reset");

btnReset.addEventListener("click", () => {
  localStorage.clear();
  window.location.reload();
});
