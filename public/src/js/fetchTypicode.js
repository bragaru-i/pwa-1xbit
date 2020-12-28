// Fetching data and apply to div.users
const users = document.querySelector('.users');

const url = 'https://jsonplaceholder.typicode.com/users';
const createUserDiv = (user) => {
  // destructuring user
  const { name, email, website, id } = user;
  // user container
  const userDiv = document.createElement('div');
  userDiv.className = 'user';

  // user__name
  const userNameDiv = document.createElement('div');
  userNameDiv.className = 'user__name';
  userNameDiv.innerHTML = name;
  userDiv.appendChild(userNameDiv);

  // user__email
  const userEmailDiv = document.createElement('div');
  userEmailDiv.className = 'user__email';
  userEmailDiv.innerHTML = email;
  userDiv.appendChild(userEmailDiv);

  // user__website
  const userWebsite = document.createElement('div');
  userWebsite.className = 'user__website';
  userWebsite.innerHTML = website;
  userDiv.appendChild(userWebsite);

  // user__id
  const userIdDiv = document.createElement('div');
  userIdDiv.className = 'user__id';
  userIdDiv.innerHTML = `ID: ${id}`;
  userDiv.appendChild(userIdDiv);
  return userDiv;
};
//  Fetching users and Append to div.users
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    data.forEach((user) => {
      users.appendChild(createUserDiv(user));
    });
  });
