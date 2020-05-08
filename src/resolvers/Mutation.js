import {v4 as uuidv4} from 'uuid'

const Mutation = {
  createUser(parent, args, {db}, info){
    const isEmailTaken = db.users.some((user) => user.email === args.data.email)
    if(isEmailTaken){
      throw new Error('E-mail is already taken.')
    }

    const user = {
      id: uuidv4(),
      ...args.data
    }
    db.users.push(user)
    return user
  },

  deleteUser(parent, args, {db}, info){
    const userIndex = db.users.findIndex((user) => user.id === args.id)
    if(userIndex === -1){
      throw new Error('User not found.')
    }

    comments = comments.filter((comment) => comment.author !== args.id)
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id
      
      if(match){
        db.comments = db.comments.filter((comment) => comment.post !== post.id)
      }
      
      return !match
    })
    const user = db.users.splice(userIndex, 1)[0]

    return user
  },

  updateUser(parent, args, {db}, info){
    const {id, data} = args
    const user = db.users.find((user) => user.id === id)

    if(!user){
      throw new Error("User not found.")
    }

    if(typeof data.email === 'string'){
      const emailTaken = db.users.some((user) => user.email === data.email)

      if (emailTaken){
        throw new Error("Email is already taken")
      }
      user.email = data.email

    }

    if(typeof data.name === 'string') {
      user.name = data.name
    }

    if(typeof data.age !== 'undefined'){ // GraphQL schema is already validating data type
      user.age = data.age
    }

    return user

  },


  createPost(parent, args, {db, pubsub}, info){
    const userExists = db.users.some((user) => user.id === args.data.author)
    if(!userExists){
      throw new Error('User not found.')
    }

    const post = {
      id: uuidv4(),
      ...args.data
    }

    debugger;
    db.posts.push(post)
    if(args.data.isPublished){
      pubsub.publish('post', {
        post: {
          mutation: 'CREATE',
          data: post
        }
      })
    }
    return post
  },

  deletePost(parent, args, {db, pubsub}, info){
    const postIndex = db.posts.findIndex((post) => post.id === args.id)
    if(postIndex === -1){
      return new Error("Post not found.")
    }

    const post = db.posts.splice(postIndex, 1)[0]
    db.comments = db.comments.filter((comment) => comment.post !== args.id)

    if(post.isPublished){
      pubsub.publish('post', {
        post: {
          mutation: 'DELETE',
          data: post
        }
      })
    }

    return post
  },

  updatePost(parents, args, {db, pubsub}, info) {
    const {id, data} = args;
    const post = db.posts.find((post) => post.id === id)
    const originalPost = {...post}

    if(!post) {
      throw new Error('Post not found')
    }

    if(data.title){
      post.title = data.title
    }
    if(data.content){
      post.content = data.content
    }
    if(data.isPublished !== undefined && data.isPublished !== null){
      post.isPublished = data.isPublished

      if(originalPost.isPublished && !post.isPublished){
        pubsub.publish('post', {
          post: {
            mutation: 'DELETE',
            data: originalPost
          }
        })
      } else if(!originalPost.isPublished && post.originalPost){
        pubsub.publish('post', {
          post: {
            mutation: 'CREATE',
            data: originalPost
          }
        })
      }

    } else if(post.isPublished) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATE',
          data: originalPost
        }
      })
    }


    return post
  },


  createComment(parent, args, {db, pubsub}, info){
    const userExists = db.users.some((user) => user.id === args.data.author)
    const postExists = db.posts.some((post) => post.id === args.data.post && post.isPublished)

    if(!userExists || !postExists){
      throw new Error('User or published post not found.')
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    }
    db.comments.push(comment)
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATE',
        data: comment 
      }
    })
    return comment
  },

  deleteComment(parent, args, {db, pubsub}, info){
    const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
    if(commentIndex === -1){
      throw new Error("Comment not found.")
    }
    const [comment] = db.comments.splice(commentIndex, 1)

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETE',
        data: comment 
      }
    })

    return comment

  },

  updateComment(parent, args, {db, pubsub}, info){
    const {id, data} = args
    const comment = db.comments.find((comment) => comment.id === id)

    if(!comment){
      throw new Error("Comment not found")
    }

    if(typeof data.text === 'string')
      comment.text = data.text

      pubsub.publish(`comment ${comment.post}`, {
        comment: {
          mutation: 'UPDATE',
          data: comment 
        }
      })      

    return comment

  }
}

export {Mutation as default}