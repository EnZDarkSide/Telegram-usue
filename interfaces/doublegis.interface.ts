export interface Meta {
    api_version: string;
    code: number;
    issue_date: string;
}

export interface Item2 {
    is_reviewable: boolean;
    tag: string;
    rating?: number;
    review_count?: number;
}

export interface Reviews {
    general_rating: number;
    general_review_count: number;
    is_reviewable: boolean;
    is_reviewable_on_flamp: boolean;
    items: Item2[];
    org_rating: number;
    org_review_count: number;
    rating?: number;
    review_count?: number;
}

export interface Rubric {
    alias: string;
    id: string;
    kind: string;
    name: string;
    parent_id: string;
    short_id: number;
}

export interface PlaceItem {
    address_comment: string;
    address_name: string;
    building_name: string;
    full_name: string;
    id: string;
    name: string;
    purpose_name: string;
    reviews: Reviews;
    rubrics: Rubric[];
    type: string;
}

export interface Result {
    items: PlaceItem[];
    total: number;
}

export interface ResponseData {
    meta: Meta;
    result: Result;
}
