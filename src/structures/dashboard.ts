export interface UiLabelsData {
    HOME_STATUS_BAR?: string,
    HOME_SUB_STATUS_BAR?: string,
    HOME_MAIN_HEADER_MENU?: string,
    HOME_MAIN_HEADER_MENU_SEARCH?: string,
    HOME_MAIN_HEADER_MENU_BUTTON?: string,
    HOME_MAIN_MY_PRODUCTS?: string,
    MY_ALL_PRODUCT?: string,
    ADD_EXPERIMENTAL_ASSESSMENT?: string,
    EXPERIMENTAL_ASSESSMENTS?: string
}

export interface DashboardTabsProps {
    sendToParent: (seachData: { vsearch: string }) => void
}
