import { atom } from 'jotai';
import { DataFetched } from '../types/types';

export const latAtom = atom<string>('');
export const lngAtom = atom<string>('');
export const isMapClickedAtom = atom<boolean>(false);
export const countryName = atom<string>('Brazil');
export const covidDataFetched = atom<DataFetched[]>([])
export const latestDay = atom<string>('');
export const dataLatestDay = atom<string>('');