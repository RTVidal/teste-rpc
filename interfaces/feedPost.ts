export interface IFeedPost {
    id: number,
    userId: number,
    userName: string,
    userAvatarURI: string,
    mediaType: string,
    mediaURI: string,
    title: string,
    qtComments: number,
    qtLikes: number
}