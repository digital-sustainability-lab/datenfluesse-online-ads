export interface Domain {
  name: string;
  thirdParties: ThirdParty[];
}
export interface ThirdParty {
  requestDomain: string;
  owner: string;
  ownerCountry: string;
}
