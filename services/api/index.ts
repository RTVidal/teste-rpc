import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const api = {
    get(service: string, body: any): Promise<any>{
        return new Promise((resolve, reject) => {
            switch(service){
                case 'feed':
                    return resolve(getFeed(body));
                case 'user':
                    return resolve(getUser(body));
                case 'post':
                    return resolve(getPost(body));
                case 'comments':
                    return resolve(getComments(body));
                
                default: reject(404);
            }
        })
    },

    post(service: string, body: any): Promise<any>{
        return new Promise((resolve, reject) => {
            switch(service){
                case 'login':
                    return resolve(postLogin(body));
                
                case 'like':
                    return resolve(postLike(body));
                
                case 'share':
                    return resolve(postShare(body));

                default: reject(404);
            }
        });
    },

    put(service: string, body: any): Promise<any>{
        return new Promise((resolve, reject) => {
            switch(service){
                case 'register':
                    return resolve(putRegister(body));
                
                case 'post':
                    return resolve(putPost(body));

                case 'comment':
                    return resolve(putComment(body));
                

                default: reject(404);
            }
        });
    }
}

export default api;

const postLogin = (credentials:{email: string, password: string}): Promise<any> => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('users')
        .then((users:any) => {
            if(users){
                const registeredUsers = JSON.parse(users);

                let user = registeredUsers.filter((ru:any) => ru.email === credentials.email && ru.password === credentials.password)[0];

                if(user) return resolve(user);
            }

            return reject();
        })
        .catch(err => {
            console.log(err);
            return reject();
        });
    });
}

const putRegister = (user:{name: string, email: string, password: string}): Promise<any> => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('users')
        .then((users:any) => {
            if(users){
                const registeredUsers = JSON.parse(users);

                if(registeredUsers.filter((ru:any) => ru.email === user.email).length) return reject('already_exists');

                const newUser = {
                    id: Date.now(),
                    ...user
                }

                registeredUsers.push(newUser);
                AsyncStorage.setItem('users', JSON.stringify(registeredUsers));

                return resolve(newUser);
            }

            const newUser = {id: Date.now(), ...user};

            AsyncStorage.setItem('users', JSON.stringify([newUser]));

            return resolve(newUser);
        })
        .catch(err => {
            console.log(err);
            return reject();
        });
    });
}

const putPost = (post:{userId: number, userName: string, title: string, videoURI: string}): Promise<any> => {
    return new Promise((resolve, reject) => {
        const postId = Date.now();
        const fileName = `${postId.toString()}.mp4`;

        const docDir = FileSystem.documentDirectory;
        const targetDir = `${docDir}/videos/${fileName}`;

        FileSystem.copyAsync({
            from: post.videoURI,
            to: targetDir
        })
        .then(() => {
            AsyncStorage.getItem('videos')
            .then(videosData => {
                let videos = [];

                if(videosData) videos = JSON.parse(videosData);                    

                videos.unshift({
                    id: postId,
                    userId: post.userId,
                    userName: post.userName,
                    title: post.title,
                    mediaURI: targetDir
                });

                AsyncStorage.setItem('videos', JSON.stringify(videos))
                .then(() => {
                    resolve(post);
                });
            });
        })
        .catch(err => {
            console.log('Erro ao mover arquivo', err);
        });
    })
}

const postLike = (postLike:{userId: number, postId: Number}): Promise<any> => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('likes')
        .then((likesData:any) => {
            let like = true;

            if(likesData){
                let storedLikes = JSON.parse(likesData);
                const storedLike = storedLikes.filter((l:any) => l.userId === postLike.userId && l.postId === postLike.postId)[0];                

                if(storedLike){
                    storedLikes = storedLikes.filter((l:any) => l.userId !== postLike.userId && l.postId !== postLike.postId);
                    like = false;
                } else {                    
                    storedLikes.push(postLike);
                }                

                AsyncStorage.setItem('likes', JSON.stringify(storedLikes));

                return resolve({like});
            }

            AsyncStorage.setItem('likes', JSON.stringify([postLike]));
            return resolve({like});
        })
        .catch(err => {
            console.log(err);
            return reject();
        });
    });
}

const postShare = (postShare:{userId: number, postId: Number}): Promise<any> => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('shares')
        .then((sharesData:any) => {
            let shared = true;

            if(sharesData){
                let storedShares = JSON.parse(sharesData);
                const storedShare = storedShares.filter((l:any) => l.userId === postShare.userId && l.postId === postShare.postId)[0];                

                if(storedShare){
                    storedShares = storedShares.filter((l:any) => l.userId !== postShare.userId && l.postId !== postShare.postId);
                    shared = false;
                } else {                    
                    storedShares.push({
                        ...postShare,
                        moment: Date.now()
                    });
                }                

                AsyncStorage.setItem('shares', JSON.stringify(storedShares));

                return resolve({shared});
            }

            AsyncStorage.setItem('shares', JSON.stringify([postShare]));
            return resolve({shared});
        })
        .catch(err => {
            console.log(err);
            return reject();
        });
    });
}

const getFeed = (filters: {userId: number, page: number}): Promise<any> => {
    return new Promise((resolve, reject) => {
        let itensPerPage:number = 3;
        let itemStart:number = itensPerPage*filters.page - itensPerPage + 1;
        let itemEnd:number = itemStart + itensPerPage;
        let allPosts:any = [];

        if(filters.userId){
            AsyncStorage.getItem('videos')
            .then(postsData => {
                AsyncStorage.getItem('shares')
                .then(sharesData => {
                    let userShares = [];
                    if(sharesData) {
                        userShares = JSON.parse(sharesData);
                        userShares = userShares.filter((s: any) => s.userId.toString() === filters.userId.toString());
                    }

                    if(postsData) allPosts = JSON.parse(postsData);

                    allPosts = allPosts.concat(defaultFeed);
                    allPosts = allPosts.filter((p:any) => p.userId.toString() === filters.userId.toString() || 
                        userShares.filter((s:any) => s.postId.toString() === p.id.toString()).length);

                    let pagePosts = filters.page ? allPosts.slice(itemStart - 1, itemEnd - 1) : allPosts;
                    let returnPosts:any = [];
                    pagePosts.forEach((p: any) => {
                        const postUser = defaultUsers.filter(u => u.id === p.userId)[0];
            
                        returnPosts.push({
                            id: p.id,
                            userId: p.userId,
                            userName: postUser ? postUser.name : p.userName,
                            userAvatarURI: postUser ? postUser.avatarURI : '',
                            mediaType: p.mediaType,
                            mediaURI: p.mediaURI,
                            title: p.title
                        });
                    });
                    
                    return resolve(returnPosts);
                });
            })
        } else {
            AsyncStorage.getItem('videos')
            .then(postsData => {
                if(postsData) allPosts = JSON.parse(postsData);
                
                allPosts = allPosts.concat(defaultFeed);

                let pagePosts = filters.page ? allPosts.slice(itemStart - 1, itemEnd - 1) : allPosts;
                let returnPosts:any = [];

                pagePosts.forEach((p: any) => {
                    const postUser = defaultUsers.filter(u => u.id === p.userId)[0];

                    returnPosts.push({
                        id: p.id,
                        userId: p.userId,
                        userName: postUser ? postUser.name : p.userName,
                        userAvatarURI: postUser ? postUser.avatarURI : '',
                        mediaType: p.mediaType,
                        mediaURI: p.mediaURI,
                        title: p.title
                    });
                });

                return resolve(returnPosts);
            });
        }
        
    });
}

const getPost = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const post = defaultFeed.filter(p => p.id.toString() === id)[0];

        AsyncStorage.getItem('likes')
        .then(likedData => {
            let likes = [];

            if(likedData){
                const storedLikes = JSON.parse(likedData);
                likes = storedLikes.filter((l:any) => l.postId === id);
            }

            if(post) {
                const postUser = defaultUsers.filter(u => u.id === post.userId)[0];
    
                if(postUser) post.userName = postUser.name;
                post.likes = likes;

                return resolve(post);
            }
    
            AsyncStorage.getItem('videos')
            .then((videosData) => {
                if(videosData){
                    const storedPosts = JSON.parse(videosData);
    
                    const storedPost = storedPosts.filter((p:any) => p.id.toString() === id)[0];
    
                    if(storedPost){
                        storedPost.likes = likes;
                        return resolve(storedPost);
                    }
                }
                
                reject(404);
            });
        });
    });
}

const getUser = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        let user = defaultUsers.filter(u => u.id.toString() === id.toString())[0];
        if(user) return resolve(user);

        AsyncStorage.getItem('users')
        .then((users:any) => {
            if(users){
                const registeredUsers = JSON.parse(users);

                user = registeredUsers.filter((ru:any) => ru.id.toString() === id.toString())[0];

                if(user) return resolve(user);
            }

            return reject();
        })
        .catch(err => {
            console.log(err);
            return reject();
        });
    });
}

const putComment = (comment:{userId: number, userName: string, postId: Number, comment:String}): Promise<any> => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('comments')
        .then((commentsData:any) => {
            if(commentsData){
                let storedComments = JSON.parse(commentsData);
                
                storedComments.push(comment);               

                AsyncStorage.setItem('comments', JSON.stringify(storedComments));

                return resolve(comment);
            }

            AsyncStorage.setItem('comments', JSON.stringify([comment]));

            return resolve(comment);
        })
        .catch(err => {
            console.log(err);
            return reject();
        });
    });
}

const getComments = (postId: number) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('comments')
        .then((commentsData:any) => {           
            let postComments:any = [];

            if(commentsData){                
                postComments = JSON.parse(commentsData);
                postComments = postComments.filter((c:any) => c.postId === postId);
            }

            return resolve(postComments);
        })
        .catch(err => {
            console.log(err);
            return reject();
        });
    });
}

const defaultUsers = [
    {
        id: 1,
        name: 'Ana Luisa',
        email: 'ana@email.com',
        password: 'ana123',
        avatarURI: '../assets/images/avatar/1.png'
    },
    {
        id: 2,
        name: 'Gabriel Souza',
        email: 'gabriel@email.com',
        password: 'gabriel123',
        avatarURI: '../assets/images/avatar/1.png'
    },
    {
        id: 3,
        name: 'Matheus Carvalho',
        email: 'matheus@email.com',
        password: 'matheus123',
        avatarURI: '../assets/images/avatar/1.png'
    }
]

const defaultFeed = [
    {
        id: 1,
        userId: 1,
        userName: '',
        mediaURI: '',
        title: 'Laranja',
        likes: []
    },
    {
        id: 2,
        userId: 2,
        userName: '',
        mediaURI: '',
        title: 'Maçã',
        likes: []
    },
    {
        id: 3,
        userId: 3,
        userName: '',
        mediaURI: '',
        title: 'Melancia',
        likes: []
    },
    {
        id: 4,
        userId: 1,
        userName: '',
        mediaURI: '',
        title: 'Banana',
        likes: []
    },
    {
        id: 5,
        userId: 2,
        userName: '',
        mediaURI: '',
        title: 'Melão',
        likes: []
    },
    {
        id: 6,
        userId: 3,
        userName: '',
        mediaURI: '',
        title: 'Uva',
        likes: []
    }
]