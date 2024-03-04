interface IPage {
    label: string,
    link: string,
}

export const pages: IPage[]=[
    {
        label: 'Редагування',
        link: 'edit',
    },
    {
        label: 'Алгоритми пошуку',
        link: 'search',
    },
]