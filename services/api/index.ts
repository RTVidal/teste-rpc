import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const api = {
    get(service: string, body: any): Promise<any>{
        return new Promise((resolve, reject) => {
            switch(service){
                case 'feed':
                    return resolve(feed(body));
                case 'user':
                    return resolve(user(body));
                case 'feed/post':
                    return resolve(getFeedPost(body));
                
                default: reject(404);
            }
        })
    },

    post(service: string, body: any): Promise<any>{
        return new Promise((resolve, reject) => {
            switch(service){
                case 'login':
                    return resolve(login(body));
                
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
                    return resolve(register(body));
                
                case 'feed/post':
                        return resolve(putFeedPost(body));
    
                

                default: reject(404);
            }
        });
    }
}

export default api;

const login = (credentials:{email: string, password: string}): Promise<any> => {
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

const register = (user:{name: string, email: string, password: string}): Promise<any> => {
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

const putFeedPost = (post:{userId: number, userName: string, title: string, videoURI: string}): Promise<any> => {
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
                    storedShares.push(postShare);
                }                

                AsyncStorage.setItem('shares', JSON.stringify(storedShares));

                console.log('shared', shared);
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

const feed = (filters: {userId: number, page: number, feedOption: string}): Promise<any> => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('videos')
        .then(videosData => {
            let allPosts:any = [];

            if(videosData){
                const storedPosts = JSON.parse(videosData);

                storedPosts.forEach((sp:any) => {
                    allPosts.push({
                        id: sp.id,
                        userId: sp.userId,
                        userName: sp.userName,
                        mediaType: 'IMAGE',
                        mediaURI: sp.mediaURI,
                        title: sp.title
                    });
                })
            }

            let defaultPosts = (filters.userId) ? defaultFeed.filter(p => p.userId.toString() === filters.userId.toString()) : defaultFeed;
            allPosts = allPosts.concat(defaultPosts);

            let itensPerPage = 2;
            let itemStart = itensPerPage*filters.page - itensPerPage + 1;
            let itemEnd = itemStart + itensPerPage;
            
            let pagePosts = filters.page ? allPosts.slice(itemStart - 1, itemEnd - 1) : allPosts;
            
            const posts:any = [];
    
            pagePosts.forEach((p: any) => {
                const postUser = defaultUsers.filter(u => u.id === p.userId)[0];
    
                posts.push({
                    id: p.id,
                    userId: p.userId,
                    userName: postUser ? postUser.name : p.userName,
                    userAvatarURI: postUser ? postUser.avatarURI : '',
                    mediaType: p.mediaType,
                    mediaURI: p.mediaURI,
                    title: p.title,
                    qtComments: 0,
                    qtLikes: 0
                });
            });
    
            resolve(posts);
        });
    });
}

const getFeedPost = (id: string): Promise<any> => {
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

const user = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        let user = defaultUsers.filter(u => u.id.toString() === id)[0];
        if(user) return resolve(user);

        AsyncStorage.getItem('users')
        .then((users:any) => {
            if(users){
                const registeredUsers = JSON.parse(users);

                user = registeredUsers.filter((ru:any) => ru.id === id)[0];

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
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Azul',
        likes: []
    },
    {
        id: 2,
        userId: 2,
        userName: '',
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Amarelo',
        likes: []
    },
    {
        id: 3,
        userId: 3,
        userName: '',
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Verde',
        likes: []
    },
    {
        id: 4,
        userId: 1,
        userName: '',
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Vermelho',
        likes: []
    },
    {
        id: 5,
        userId: 2,
        userName: '',
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Laranja',
        likes: []
    },
    {
        id: 6,
        userId: 3,
        userName: '',
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Cinza',
        likes: []
    }
]