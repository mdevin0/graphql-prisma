const Query = {
  user(){
    return {
      id: '1',
      name: 'Root',
      email: 'root@linux.com'
    }
  },
  users(parent, args, {db}, info){
    if(!args.query){
      return db.users
    } else {
      return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    }
  },
  post(){
    return {
      id: '1',
      title: 'How to execute any command you want',
      content: 'Just add the word "sudo" before it',
      published: true
    }
  },
  posts(parent, args, {db}, info){
    if(!args.query){
      return db.posts
    }

    return db.posts.filter((post) => {
      return post.title.toLowerCase().includes(args.query.toLowerCase()) 
          || post.content.toLowerCase().includes(args.query.toLowerCase())
    })

  },
  comments(parent, args, {db}, info){
    return db.comments
  }
}

export {Query as default}