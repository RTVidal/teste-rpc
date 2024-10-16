import AsyncStorage from '@react-native-async-storage/async-storage';

const api = {
    get(service: string, body: any): Promise<any>{
        return new Promise((resolve, reject) => {
            switch(service){
                case 'feed':
                    return resolve(feed(body));
                
                default: reject(404);
            }
        })
    },

    post(service: string, body: any): Promise<any>{
        return new Promise((resolve, reject) => {
            switch(service){
                case 'login':
                    return resolve(login(body));

                case 'register':
                    return resolve(register(body));

                default: reject(404);
            }
        });
    },

    put(service: string){

    },

    delete(service: string){

    }
}

export default api;

const login = (credentials:{email: string, password: string}): Promise<any> => {
    return new Promise((resolve, reject) => {
        let user = defaultUsers.filter(u => u.email === credentials.email && u.password === credentials.password)[0];

        if(user) return resolve(user);

        AsyncStorage.getItem('users')
        .then((users:any) => {
            if(users){
                const registeredUsers = JSON.parse(users);

                user = registeredUsers.filter((ru:any) => ru.email === credentials.email && ru.password === credentials.password)[0];

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

const feed = (filters: {userId: number, page: number, feedOption: string}): Promise<any> => {
    return new Promise((resolve, reject) => {
        let defaultPosts = defaultFeed;

        let itensPerPage = 3;
        let itemStart = itensPerPage*filters.page - itensPerPage + 1;
        console.log('itemStart', itemStart);
        let itemEnd = itemStart + itensPerPage;
        let allPosts = [...defaultPosts];
        let pagePosts = allPosts.slice(itemStart - 1, itemEnd - 1);
        
        const posts:any = [];

        pagePosts.forEach(p => {
            const postUser = defaultUsers.filter(u => u.id === p.userId)[0];

            posts.push({
                id: p.id,
                userId: p.userId,
                userName: postUser.name,
                userAvatarURI: postUser.avatarURI,
                mediaType: p.mediaType,
                mediaURI: p.mediaType,
                title: p.title,
                qtComments: 0,
                qtLikes: 0
            });
        });
        console.log('posts', posts);
        resolve(posts);
    });
}

const defaultUsers = [
    {
        id: 1,
        name: 'Ana Luisa',
        email: 'ana@email.com',
        password: 'ana123',
        avatarURI: ''
    },
    {
        id: 2,
        name: 'Gabriel Souza',
        email: 'gabriel@email.com',
        password: 'gabriel123',
        avatarURI: ''
    },
    {
        id: 3,
        name: 'Matheus Carvalho',
        email: 'matheus@email.com',
        password: 'matheus123',
        avatarURI: ''
    }
]

const defaultFeed = [
    {
        id: 1,
        userId: 1,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Azul'
    },
    {
        id: 2,
        userId: 2,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Amarelo'
    },
    {
        id: 3,
        userId: 3,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Verde'
    },
    {
        id: 4,
        userId: 1,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Vermelho'
    },
    {
        id: 5,
        userId: 2,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Laranja'
    },
    {
        id: 6,
        userId: 3,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Cinza'
    },
    {
        id: 7,
        userId: 1,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Preto'
    },
    {
        id: 8,
        userId: 2,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Roxo'
    },
    {
        id: 9,
        userId: 3,
        mediaType: 'IMAGE',
        mediaURI: '',
        title: 'Rosa'
    }
]