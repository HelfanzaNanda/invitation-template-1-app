export type SectionField = {
    field: string,
    type: string,
    children: SectionChild[]
}
export type SectionChild = {
    child: SectionField[]
}


export type Section = {
    id?: number;
    title?: string;
    fields?: SectionField[];
}