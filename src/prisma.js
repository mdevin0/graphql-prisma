import {Prisma} from 'prisma-binding'


const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,

})

const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({id: authorId})
  if(!userExists){
    throw new Error('User not found.')
  }

  const post = await prisma.mutation.createPost({
    data: {
      ...data,
      author: {
        connect: {
          id: authorId
        }
      }
    }
  }, '{ author { id name email posts { id title isPublished } } }')
  
  return post.author
}

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({id: postId})
  if(!postExists){
    throw new Error('Post not found.')
  }
  
  const post = await prisma.mutation.updatePost({
    where: {
      id: postId
    },
    data: data
  }, '{ author { id name email posts { id title isPublished } } }')
  
  return post.author
}

createPostForUser("noexist", {title: "Yay!", content: "Nay!", isPublished: true})
.then((user) => console.log(JSON.stringify(user, undefined, 2)))
.catch((error) => console.error(error.message))

updatePostForUser("noexist", {isPublished: true})
.then((user) => console.log(JSON.stringify(user, undefined, 2)))
.catch((error) => console.error(error.message))