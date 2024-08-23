export interface CasesDataFetched {
    cases: Cases
}
export interface Cases {
    [date: string]: CaseData
}

export interface CaseData {
    new: string;
    total: string;
}
export interface DeathsDataFetched{
    deaths: {
        [date: string]: CaseData;
    };
}

export interface FeatureProperties {
    name: string;
}

export interface GeoJSONFeature {
    type: 'Feature';
    properties: FeatureProperties;
    geometry: GeoJSON.Geometry;
    id?: string | number;
}

export interface Serie {
    name: string,
    data: number[]
}