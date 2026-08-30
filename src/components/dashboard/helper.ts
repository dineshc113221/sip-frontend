import { MemberList } from "../../structures/packaging";
import { ExperimentalDataItem,Brand } from "../breadcrumb/types";

export const productSortFunction = (
  data: ExperimentalDataItem[],
  sortValue
) => {
  return data
    .slice()
    .sort((a, b) => {
      switch (sortValue) {
        case "Modified Date": {
          const convertDateA = a.updatedAt
            ? new Date(a.updatedAt)
            : new Date(0);
          const convertDateB = b.updatedAt
            ? new Date(b.updatedAt)
            : new Date(0);
          return (
            new Date(convertDateA).getTime() - new Date(convertDateB).getTime()
          );
        }

        case "A-Z":
          return (b.productName ?? "").localeCompare(
            a.productName ?? "",
            "en",
            { numeric: true }
          );

        case "Created Date": {
          const createdDateA = a.createdAt
            ? new Date(a.createdAt)
            : new Date(0);
          const createdDateB = b.createdAt
            ? new Date(b.createdAt)
            : new Date(0);
          return (
            new Date(createdDateA).getTime() - new Date(createdDateB).getTime()
          );
        }

        default:
          return 0;
      }
    })
    .reverse();
};


export const brandSortFunction = (
  data: Brand[]
) => {
  return data
    .slice()
    .sort((a, b) => {
          return (b.longBrandName ?? "").localeCompare(
            a.longBrandName ?? "",
            "en",
            { numeric: true }
          );
    })
    .reverse();
};


export const memberuserSortFunction = (
  data: MemberList[]
) => {
  return data
    .slice()
    .sort((a, b) => {
          return (b.displayName ?? "").localeCompare(
            a.displayName ?? "",
            "en",
            { numeric: true }
          );
    })
    .reverse();
};