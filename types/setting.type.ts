import { Media } from "./media.type";

export type Setting = {
    id?: number;
    groom?: string;
    groomCaption?: string;
    groomInstagram?: string;
    groomPhotoId?: number;
    groomPhoto?: Media;
    bride?: string;
    brideCaption?: string;
    brideInstagram?: string;
    bridePhotoId?: number;
    bridePhoto?: Media;
    date?: string;
    songId?: string;
    song?: Media;
    captionFooter?: string;
}