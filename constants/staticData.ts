import { Share } from "react-native";
import { APP_LINK } from "./constant";

// import dayjs from "dayjs";
export const popularCitiesList = [
  {
    id: "clxy7z8qt00000clg4x71e8i8",
    name: "Mumbai",
    image: require("../assets/images/PopularCities/Mumbai0.jpg"),
  },
  {
    id: "cm5f7za3v03ku227ugvobchxs",
    name: "Delhi",
    image: require("../assets/images/PopularCities/delhi.jpg"),
  },
  {
    id: "cm5f7za4204tx227ulj5we289",
    name: "Pune",
    image: require("../assets/images/PopularCities/pune.jpg"),
  },
  {
    id: "cm5f7za3y041z227ui51l06nw",
    name: "Bengaluru",
    image: require("../assets/images/PopularCities/bengaluru.jpeg"),
  },
  {
    id: "cm5f7za4a05lw227ufrbg2s2w",
    name: "Hyderabad",
    image: require("../assets/images/PopularCities/hyderabad.jpg"),
  },
  {
    id: "cm5f7za3x03tv227ufv19fd67",
    name: "Surat",
    image: require("../assets/images/PopularCities/surat.png"),
  },
  {
    id: "cm5f7za3z04cc227uq1jnzqdj",
    name: "Bhopal",
    image: require("../assets/images/PopularCities/bhopal.jpeg"),
  },
  {
    id: "cm5f7za4g06b6227u9q2en6ma",
    name: "Kolkata",
    image: require("../assets/images/PopularCities/kolkata.jpg"),
  },
];

// const getDaysLeft = (auctionDate: string) => {
//     const today = dayjs();
//     const auctionDay = dayjs(auctionDate);
//     const daysLeft = auctionDay.diff(today, "day");
//     return daysLeft > 0 ? `${daysLeft} days left` : "Auction ended";
//   };

export const formateDate = (dateStr: string) => {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  return date?.toDateString()?.substring(4);
};

export const onShare = async ({ id, assetType, city }) => {
  try {
    const result = await Share.share({
      title: "Auction Link",
      message: `Find this auction on E-Auctionshub.com. Link: https://eauctionshub.com/auction/${id}/${assetType}-in-${city}`,
      url: `https://eauctionshub.com/auction/${id}/${assetType}-in-${city}`,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
      } else {
      }
    } else if (result.action === Share.dismissedAction) {
    }
  } catch (error) {
    console.log(error);
  }
};

export const sortList = [
  {
    label: "Price: Low to High",
    value: "orderBy=price&order=asc",
  },
  {
    label: "Price: High to Low",
    value: "orderBy=price&order=desc",
  },
  {
    label: "Auction date (asc)",
    value: "orderBy=date&order=asc",
  },
  {
    label: "Auction date (des)",
    value: "orderBy=date&order=desc",
  },
];
