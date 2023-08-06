const bookContainer = document.getElementById('bookContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const pageCount = document.getElementById('pageCount');
const errorContainer = document.getElementById('errorContainer');

async function getBooks() {
    try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=javascript');
        const data = await response.json();

        return data.items;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

let currentPage = 1;
const booksPerPage = 3;
let totalBooks = 0;

async function loadInitialBooks() {
    try {
        const startIndex = (currentPage - 1) * booksPerPage;

        const books = await getBooks();
        totalBooks = books.length;

        for (let i = startIndex; i < startIndex + booksPerPage; i++) {
            if (i >= totalBooks) {
                loadMoreBtn.style.display = 'none';
                break;
            }

            const book = books[i];
            const bookCard = createBookCard(book);
            bookContainer.appendChild(bookCard);
        }

        pageCount.textContent = `Сторінка ${currentPage}`;

        if (startIndex + booksPerPage >= totalBooks) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        errorContainer.textContent = 'Виникла помилка при отриманні даних. Спробуйте пізніше.';
        console.error('Помилка отримання даних:', error);
    }
}

searchBtn.addEventListener('click', () => {
  errorContainer.textContent = '';

  const searchTerm = searchInput.value.trim();
  if (searchTerm !== '') {
      bookContainer.innerHTML = '';

      displaySearchedBooks(searchTerm);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;

  if (endIndex >= totalBooks) {
    loadMoreBtn.style.display = 'none';
  }

  try {
    const books = await getBooks();

    for (let i = startIndex; i < endIndex; i++) {
      if (i >= totalBooks) {
        loadMoreBtn.style.display = 'none';
        break;
      }

      const book = books[i];
      const bookCard = createBookCard(book);
      bookContainer.appendChild(bookCard);
    }

    pageCount.textContent = `Сторінка ${currentPage}`;
  } catch (error) {
    console.error('Помилка отримання даних:', error);
  }
});

async function displaySearchedBooks(searchTerm) {
  try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`);
      const data = await response.json();

      const books = data.items;

      if (!books || books.length === 0) {
          bookContainer.innerHTML = '<p>Нічого не знайдено.</p>';
          return;
      }

      bookContainer.innerHTML = '';
      
      for (let i = 0; i < books.length; i++) {
          const book = books[i];
          const bookCard = createBookCard(book);
          bookContainer.appendChild(bookCard);
      }
  } catch (error) {
      console.error('Помилка отримання даних:', error);
  }
}

function createBookCard(book) {
  const bookCard = document.createElement('div');
  bookCard.classList.add('book-card');

  const title = document.createElement('h2');
  title.textContent = book.volumeInfo.title;

  const authors = document.createElement('p');
  authors.textContent = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';

  const cover = document.createElement('img');
  cover.src = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'no-image.png';

  bookCard.appendChild(title);
  bookCard.appendChild(authors);
  bookCard.appendChild(cover);

  return bookCard;
}

loadInitialBooks();

