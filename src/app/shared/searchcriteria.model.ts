export interface ISearchCriteriaModel {
    searchText: string;
    useAdditionalCriteria: boolean;
    criteriaType: string;
    criteriaConstellation: string;
    criteriaMagnitudeMax: string;
    criteriaSizeMin: string;
    criteriaAltMin: string;
    criteriaAltMax: string;
    criteriaAzMin: string;
    criteriaAzMax: string;
    criteriaTimeUt: string;
    criteriaLat: number;
    criteriaLng: number;
}