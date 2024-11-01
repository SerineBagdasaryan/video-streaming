import { MediaTypes } from "../enum";

export function generateUniqueFileName(userId: number, type: MediaTypes): string {
    const timestamp = Date.now();
    return `${userId}-${type}-${timestamp}.webm`;
}
