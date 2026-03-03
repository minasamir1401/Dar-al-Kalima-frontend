export interface Book {
    id: number;
    title: string;
    url: string;
    image: string;
    download_url: string;
    category: string;
}

export interface Course {
    id: number;
    title: string;
    instructor: string;
    lessons: string;
    duration: string;
    image: string;
    url: string;
    category: string;
    lessons_data?: { title: string, videoId: string, duration: string }[] | null;
}

export interface Verse {
    text: string;
    reference: string;
}

export interface KidsSection {
    title: string;
    icon: string;
    color: string;
    videos: { title: string, id: string }[];
}
