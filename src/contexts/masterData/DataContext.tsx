import {createContext ,useContext } from "react";

export interface Post {
    _id: string;
    formulation: Formulation;
    brand?: (BrandEntity)[] | null;
    loggedInUserDetails: LoggedInUserDetails;
    packaging:Packaging;
  }
 
  export interface Formulation {
    netContent?: (string)[] | null;
    productionZone?: (string)[] | null;
    salesZone?: (string)[] | null;
    segment?: (SegmentEntity)[] | null;
    useDose?: (string)[] | null;
    useScenario?:(string)[] | null;
  }

  export interface SegmentEntity {
    productSegment: string;
    productSubSegment?: (string)[] | null;
  }
  
  export interface BrandEntity {
    brandName: string;
    shortBrandCode: string;
    longBrandName: string;
  }

  export interface LoggedInUserDetails {
    businessPhones?: string[] | null;
    displayName: string;
    givenName: string;
    jobTitle?: string | null; //  updated here
    mail: string;
    mobilePhone?: string | null;
    officeLocation?: string | null;
    preferredLanguage?: string | null;
    surname: string;
    userPrincipalName: string;
    id: string;
    roles?: string[] | null;
    userName: string;
    accessToken: string;
  }
  
  export interface BasicUserInfo {
    givenName: string;
    displayName: string;
    mail: string;
    accessToken: string;
    roles?: string[] | null;
  }
interface Truspice{
  tru_name: string;
  spice_name: string;
  }
  interface DataType {
    name: Truspice;
    type: Truspice[];
   }

  export interface Packaging {
    componentType?: string[] | null;
    opacity?: string[] | null;
    color?: string[] | null;
    "pcr/pir/virgin"?: string[] | null;
    convertingProcess?: string[] | null;
    finishing_process?: Truspice[] | null;
    packagingMaterial?:string[] | null;
    materials?:DataType[]|null;
    opacifier?: string[] | null;
    layer?: string[] | null;
    subComponents?:string[] | null;
  }

  export interface PostContextType {
    loaded: boolean;
    globaldata: Post[] | null;
    formulationData: Formulation;
    packagingData: Packaging;
    token: string | null;
    loggedInUser?: BasicUserInfo | null; 
    setLoggedInUser?: (user: BasicUserInfo) => void; 
  }
  
  const PostContext = createContext<PostContextType>({
    loaded: false,
    globaldata: [],
    formulationData: {},
    packagingData: {},
    token: 'some_token_value',
    loggedInUser: null,
    setLoggedInUser: () => {},
  });
  
  const useGlobaldata = () => useContext(PostContext);

  export {PostContext,useGlobaldata};