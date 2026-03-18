export interface User {
    id: string;
    displayName: string | null;
    IconURL: string | null;
    useProvidedIcon: boolean;
}

export interface UpdateUser {
    displayName: string | null;
    useProvidedIcon: boolean;
}

export interface Comment {
    id: string;
    songID: string;
    user: User;
    content: string;
    createdAt: number;
    updatedAt: number;
}
