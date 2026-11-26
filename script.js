const titleInput = document.getElementById('ticket-title');
const roomInput = document.getElementById('ticket-room');
const categorySelect = document.getElementById('ticket-category');
const addBtn = document.getElementById('add-btn');
const errorMsg = document.getElementById('error-msg');
const ticketList = document.getElementById('ticket-list');

const filterStatusSelect = document.getElementById('filter-status');
const filterCategorySelect = document.getElementById('filter-category');

const tickets = [
  { title: 'Проектор не включается', room: '203', category: 'Оборудование', done: false },
  { title: 'Не закрывается окно', room: '105', category: 'Аудитория', done: false },
  { title: 'В коридоре не горит свет', room: 'Коридор, 2-й этаж', category: 'Другое', done: true }
];

function renderTickets() {
  ticketList.innerHTML = '';

  if (tickets.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-msg';
    emptyItem.textContent = 'Заявок пока нет';
    ticketList.append(emptyItem);
    return;
  }

  const statusFilter = filterStatusSelect.value; 
  const selectedCategory = filterCategorySelect.value;
  let renderedCount = 0;

  tickets.forEach((ticket, index) => {
    if (statusFilter === 'open' && ticket.done) return;
    if (statusFilter === 'closed' && !ticket.done) return;
    if (selectedCategory !== 'all' && ticket.category !== selectedCategory) return;

    renderedCount++;

    const li = document.createElement('li');
    li.className = 'ticket-item';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'ticket-info';

    const titleEl = document.createElement('div');
    titleEl.className = 'ticket-title';
    titleEl.textContent = ticket.title;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'ticket-meta';

    const roomSpan = document.createElement('span');
    roomSpan.textContent = `Место: ${ticket.room}`;

    const categorySpan = document.createElement('span');
    categorySpan.textContent = `Категория: ${ticket.category}`;

    const statusSpan = document.createElement('span');
    statusSpan.className = ticket.done ? 'status status-done' : 'status status-open';
    statusSpan.textContent = ticket.done ? 'Выполнена' : 'Открыта';

    metaDiv.append(roomSpan, categorySpan, statusSpan);
    infoDiv.append(titleEl, metaDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'ticket-actions';

    if (!ticket.done) {
      const doneBtn = document.createElement('button');
      doneBtn.type = 'button';
      doneBtn.className = 'btn-done';
      doneBtn.textContent = 'Выполнить';
      doneBtn.addEventListener('click', () => {
        tickets[index].done = true;
        renderTickets();
      });
      actionsDiv.append(doneBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => {
      tickets.splice(index, 1);
      renderTickets();
    });
    actionsDiv.append(deleteBtn);

    li.append(infoDiv, actionsDiv);
    ticketList.append(li);
  });

  if (renderedCount === 0) {
    const emptyFilterItem = document.createElement('li');
    emptyFilterItem.className = 'empty-msg';
    emptyFilterItem.textContent = 'Нет заявок, соответствующих выбранным фильтрам';
    ticketList.append(emptyFilterItem);
  }
}

addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const room = roomInput.value.trim();
  const category = categorySelect.value;

  if (!title || !room || !category) {
    errorMsg.textContent = 'Пожалуйста, заполните все поля и выберите категорию.';
    return;
  }

  errorMsg.textContent = '';
  tickets.push({ title: title, room: room, category: category, done: false });
  
  titleInput.value = '';
  roomInput.value = '';
  categorySelect.value = '';
  renderTickets();
});

filterStatusSelect.addEventListener('change', renderTickets);
filterCategorySelect.addEventListener('change', renderTickets);

renderTickets();