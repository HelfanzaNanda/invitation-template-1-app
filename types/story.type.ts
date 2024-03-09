import { Media } from "./media.type";
import { TransformKeysToCamelCase } from "./string.type";

export type Story = {
    id?: number;
    mediaId?: number;
    media?: Media;
    title?: string;
    caption?: string;
    year?: string;
}
// export type Story = TransformKeysToCamelCase<{
//     id?: number;
//     media_id?: number;
//     media?: Media;
//     title?: string;
//     caption?: string;
//     year?: string;
// }>