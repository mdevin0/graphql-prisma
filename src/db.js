const users = [{
  id: '1',
  name: 'Me',
  email: 'me@here.com',
  age: 30
},{
  id: '2',
  name: 'You',
  email: 'you@here.com',
  age: 45
},{
  id: '3',
  name: 'Us',
  email: 'us@here.com',
}]

const posts = [{
  id: '1',
  title: 'Amazingly amazing',
  content: 'This post is amazing!',
  isPublished: true,
  author: '1'
},{
  id: '2',
  title: 'Spider-man',
  content: 'The amazing Spider-Man!',
  isPublished: false,
  author: '1'
},{
  id: '3',
  title: 'No idea',
  content: 'I ran out of ideas.',
  isPublished: true,
  author: '2'
}]

const comments = [{
  id: '1',
  text: 'This is a comment!',
  author: '1',
  post: '1'
},{
  id: '2',
  text: 'This is another comment!',
  author: '2',
  post: '3'
},{
  id: '3',
  text: 'This is one more comment!',
  author: '2',
  post: '3'
},{
  id: '4',
  text: 'Last comment!',
  author: '3',
  post: '2'
}]

const db = {
  users,
  posts,
  comments
}

export { db as default }