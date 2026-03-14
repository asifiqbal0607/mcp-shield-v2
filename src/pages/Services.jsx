import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import { Card, SectionTitle, Badge } from "../components/ui";
import { BLUE, GREEN, AMBER, ROSE, VIOLET, SLATE } from "../constants/colors";
import { repTrend } from "../data/charts";

const T = "#0d9488"; // teal accent

const API_CALL_DATA = [
  { name: "Shield", calls: 10 },
  { name: "Click", calls: 8 },
  { name: "APK", calls: 6 },
  { name: "Fraud", calls: 5 },
  { name: "Export", calls: 70 },
  { name: "Geo", calls: 4 },
  { name: "Notification", calls: 320 },
];

const BAR_COLORS = [BLUE, GREEN, VIOLET, ROSE, AMBER, "#06b6d4", "#f97316"];

const svcRows = [
  {
    id: 1,
    name: "True Digital Group Co.,Ltd (4237) | Horo Sap4 - 4237424 - True",
    serviceId: "-36KlpABQGMxF54qLUGn",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-10",
    lastUpdate: "2024-06-01",
  },
  {
    id: 2,
    name: "True Digital Group Co.,Ltd (4239) | Wan Duang dee 3 - 4239469 - True",
    serviceId: "-37bZ5MBQGMxF54qXIB_",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-12",
    lastUpdate: "2024-06-03",
  },
  {
    id: 3,
    name: "True Digital Group Co.,Ltd (4238) | Hora Duange4 - 4238572 - True",
    serviceId: "-6gEeJcBP_A8TV-HbUzE",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-15",
    lastUpdate: "2024-06-05",
  },
  {
    id: 4,
    name: "gvi services | anus-sub-acc",
    serviceId: "-8u4q5cB1fchDeWJNjg3",
    status: "active",
    client: "GVI",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-01",
    lastUpdate: "2024-06-10",
  },
  {
    id: 5,
    name: "True Digital Group Co.,Ltd (4237) | Horo Sap - 4237421 - True",
    serviceId: "-H6llpABQGMxF54qjEGX",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-10",
    lastUpdate: "2024-06-12",
  },
  {
    id: 6,
    name: "Teleinfotech | Duang Den - 4218043 - True",
    serviceId: "-H6kiZEBQGMxF54qRUQX",
    status: "active",
    client: "Teleinfotech",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-01",
    lastUpdate: "2024-06-15",
  },
  {
    id: 7,
    name: "True Digital Group Co.,Ltd (4239) | Health care 2 - 4239462 - True",
    serviceId: "-H7RZ5MBQGMxF54q0IAp",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-05",
    lastUpdate: "2024-06-18",
  },
  {
    id: 8,
    name: "True Digital Group Co.,Ltd (4238) | XR Academy - 4238069 - True",
    serviceId: "-Mp2d5AB-W5fcuufUc83",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-10",
    lastUpdate: "2024-06-20",
  },
  {
    id: 9,
    name: "True Digital Group Co.,Ltd (4239) | Horo Lucky Dee9 - 4239355 - True",
    serviceId: "-Muv_ZQB-W5fcuufnkmx",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-15",
    lastUpdate: "2024-06-22",
  },
  {
    id: 10,
    name: "True Digital Group Co.,Ltd (4237) | Horo Sap2 - 4237422 - True",
    serviceId: "-X6JlpABQGMxF54qHkFO",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-01",
    lastUpdate: "2024-06-25",
  },
  {
    id: 11,
    name: "iPay Service",
    serviceId: "qcmk0vBzyQ83DjMqcw",
    status: "inactive",
    client: "TPay",
    vsBrand: "--",
    type: "API",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-01",
    lastUpdate: "2024-07-01",
  },
  {
    id: 12,
    name: "True Digital Group Co.,Ltd (4237) | Playit 4G - 4237501 - True",
    serviceId: "-HojgaAp0UTzhMFYlJtg",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-13",
    lastUpdate: "2024-02-16",
  },
  {
    id: 13,
    name: "True Digital Group Co.,Ltd (4239) | iPay Gold - 4239510 - True",
    serviceId: "-udbpnuwsOUWVUbgcvu",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-14",
    lastUpdate: "2024-03-17",
  },
  {
    id: 14,
    name: "True Digital Group Co.,Ltd (4238) | Lucky Star - 4238601 - True",
    serviceId: "-RD7dwLUJB7MlHxwlV7",
    status: "active",
    client: "True Digital",
    vsBrand: "ZainBrand",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-15",
    lastUpdate: "2024-04-18",
  },
  {
    id: 15,
    name: "GVI Services | sub-acc-gold",
    serviceId: "qa8vpn7mGbxDEYzXGiM",
    status: "active",
    client: "GVI",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-16",
    lastUpdate: "2024-05-19",
  },
  {
    id: 16,
    name: "True Digital Group Co.,Ltd (4237) | Wan Dee5 - 4237530 - True",
    serviceId: "-Hzq3gp48ycSwb6TXfpX",
    status: "active",
    client: "True Digital",
    vsBrand: "TrueMove",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-17",
    lastUpdate: "2024-06-20",
  },
  {
    id: 17,
    name: "Teleinfotech | Duang Den 2 - 4218080 - True",
    serviceId: "qBm3U5M_khmCilTedPF",
    status: "active",
    client: "Teleinfotech",
    vsBrand: "Shield",
    type: "--",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-06-18",
    lastUpdate: "2024-07-21",
  },
  {
    id: 18,
    name: "True Digital Group Co.,Ltd (4239) | Health Care 3 - 4239480 - True",
    serviceId: "-Hn6yV9LTo1L384N0dvP",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "Safaricom-KE",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-07-19",
    lastUpdate: "2024-08-22",
  },
  {
    id: 19,
    name: "True Digital Group Co.,Ltd (4238) | XR Plus - 4238090 - True",
    serviceId: "-X42QmITQr5gQ1r65plZ",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "MTN-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-08-20",
    lastUpdate: "2024-09-23",
  },
  {
    id: 20,
    name: "Zain Iraq | Click Guard - ZQ001",
    serviceId: "KZmtyKXIKuGEo7nQBp_",
    status: "active",
    client: "Zain",
    vsBrand: "ZainBrand",
    type: "--",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-09-21",
    lastUpdate: "2024-10-24",
  },
  {
    id: 21,
    name: "Asiacell | Shield Pro - AC002",
    serviceId: "-M1WdDi_gqrW96ZHDTSJ",
    status: "active",
    client: "Asiacell",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-10-22",
    lastUpdate: "2024-11-25",
  },
  {
    id: 22,
    name: "True Digital Group Co.,Ltd (4237) | Horo Sap3 - 4237440 - True",
    serviceId: "-XuIAX8WjUv4OgtSHICM",
    status: "active",
    client: "True Digital",
    vsBrand: "TrueMove",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-11-23",
    lastUpdate: "2024-12-26",
  },
  {
    id: 23,
    name: "MTN Nigeria | Fraud Net - MT003",
    serviceId: "-oU_WleySeIowS0N4Td",
    status: "active",
    client: "MTN",
    vsBrand: "Shield",
    type: "--",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-12-24",
    lastUpdate: "2024-01-27",
  },
  {
    id: 24,
    name: "Safaricom Kenya | Geo Shield - SK004",
    serviceId: "-HIqFuOL-5fM-D_pWSgE",
    status: "active",
    client: "Safaricom",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-25",
    lastUpdate: "2024-02-28",
  },
  {
    id: 25,
    name: "True Digital Group Co.,Ltd (4239) | Hora Duange5 - 4239500 - True",
    serviceId: "-MWbLCzM65Ba8V81GhQt",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-26",
    lastUpdate: "2024-03-28",
  },
  {
    id: 26,
    name: "Airtel Nigeria | Click Tracker - AN005",
    serviceId: "-MbZnXgU9CX_w365dpH3",
    status: "active",
    client: "Airtel",
    vsBrand: "ZainBrand",
    type: "--",
    mno: "Safaricom-KE",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-27",
    lastUpdate: "2024-04-28",
  },
  {
    id: 27,
    name: "GVI Services | sub-acc-platinum",
    serviceId: "qESZmZF6e4OCdE5QMCC",
    status: "active",
    client: "GVI",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "MTN-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-28",
    lastUpdate: "2024-05-28",
  },
  {
    id: 28,
    name: "True Digital Group Co.,Ltd (4238) | Horo Lucky2 - 4238700 - True",
    serviceId: "-5fG6GFVZXiCJeM1UGr",
    status: "active",
    client: "True Digital",
    vsBrand: "TrueMove",
    type: "--",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-01",
    lastUpdate: "2024-06-04",
  },
  {
    id: 29,
    name: "Vodacom Tanzania | Shield Basic - VT006",
    serviceId: "q1e93RIVoBP00rJ3K27",
    status: "active",
    client: "Vodacom",
    vsBrand: "Shield",
    type: "--",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-06-02",
    lastUpdate: "2024-07-05",
  },
  {
    id: 30,
    name: "True Digital Group Co.,Ltd (4237) | Wan Duang6 - 4237550 - True",
    serviceId: "-sRpi2gDNtfM1DGOk2X",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-07-03",
    lastUpdate: "2024-08-06",
  },
  {
    id: 31,
    name: "Teleinfotech | Duang Den 3 - 4218100 - True",
    serviceId: "KwGFnfCtWEmUJjAoN9Y",
    status: "active",
    client: "Teleinfotech",
    vsBrand: "--",
    type: "--",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-08-04",
    lastUpdate: "2024-09-07",
  },
  {
    id: 32,
    name: "True Digital Group Co.,Ltd (4239) | Horo Sap5 - 4239520 - True",
    serviceId: "-USyZ5PSUvn7jV4KqvK",
    status: "active",
    client: "True Digital",
    vsBrand: "ZainBrand",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-09-05",
    lastUpdate: "2024-10-08",
  },
  {
    id: 33,
    name: "Zain Iraq | Bot Filter - ZQ007",
    serviceId: "qM_F5Hpha-b7EAWrB_P",
    status: "active",
    client: "Zain",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-10-06",
    lastUpdate: "2024-11-09",
  },
  {
    id: 34,
    name: "True Digital Group Co.,Ltd (4238) | Health Care 4 - 4238800 - True",
    serviceId: "-X9F98qQP1Aa9KINbRgy",
    status: "active",
    client: "True Digital",
    vsBrand: "TrueMove",
    type: "--",
    mno: "Safaricom-KE",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-11-07",
    lastUpdate: "2024-12-10",
  },
  {
    id: 35,
    name: "Asiacell | Redirect Flow - AC008",
    serviceId: "-HUffVreDG708fXlP6Ct",
    status: "active",
    client: "Asiacell",
    vsBrand: "Shield",
    type: "--",
    mno: "MTN-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-12-08",
    lastUpdate: "2024-01-11",
  },
  {
    id: 36,
    name: "True Digital Group Co.,Ltd (4237) | XR Academy2 - 4237560 - True",
    serviceId: "-HLmsdIWGE-SNRe_IYTq",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-09",
    lastUpdate: "2024-02-12",
  },
  {
    id: 37,
    name: "MTN Nigeria | Click Guard2 - MT009",
    serviceId: "-M5_nsGpdQHhFO2gmla5",
    status: "active",
    client: "MTN",
    vsBrand: "--",
    type: "--",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-10",
    lastUpdate: "2024-03-13",
  },
  {
    id: 38,
    name: "True Digital Group Co.,Ltd (4239) | Lucky Dee10 - 4239540 - True",
    serviceId: "-X8G-FBobbU750WpFGGC",
    status: "active",
    client: "True Digital",
    vsBrand: "ZainBrand",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-11",
    lastUpdate: "2024-04-14",
  },
  {
    id: 39,
    name: "Safaricom Kenya | Fraud Net2 - SK010",
    serviceId: "qoChudk_Cziq9f-vEqu",
    status: "active",
    client: "Safaricom",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-12",
    lastUpdate: "2024-05-15",
  },
  {
    id: 40,
    name: "GVI Services | sub-acc-silver",
    serviceId: "-H7ZKvGkg4WpyoQMwDEw",
    status: "active",
    client: "GVI",
    vsBrand: "TrueMove",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-13",
    lastUpdate: "2024-06-16",
  },
  {
    id: 41,
    name: "True Digital Group Co.,Ltd (4238) | Wan Dee7 - 4238900 - True",
    serviceId: "-H-lw3aNHXTV_tlewB52",
    status: "active",
    client: "True Digital",
    vsBrand: "Shield",
    type: "--",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-06-14",
    lastUpdate: "2024-07-17",
  },
  {
    id: 42,
    name: "TPay | Gold Payment API",
    serviceId: "-AqesEfJ7btbdTu2Gqi",
    status: "inactive",
    client: "TPay",
    vsBrand: "--",
    type: "MSISDN",
    mno: "Safaricom-KE",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-07-15",
    lastUpdate: "2024-08-18",
  },
  {
    id: 43,
    name: "Airtel Nigeria | OTP Gateway - AN011",
    serviceId: "-HV4pTKbqK_lAvZuVMq5",
    status: "inactive",
    client: "Airtel",
    vsBrand: "--",
    type: "WAP",
    mno: "MTN-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-08-16",
    lastUpdate: "2024-09-19",
  },
  {
    id: 44,
    name: "True Digital Group Co.,Ltd (4237) | Legacy Sap - 4237099 - True",
    serviceId: "KJra92SY7dKi-KDExkd",
    status: "inactive",
    client: "True Digital",
    vsBrand: "ZainBrand",
    type: "OTP",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-09-17",
    lastUpdate: "2024-10-20",
  },
  {
    id: 45,
    name: "Vodacom Tanzania | WAP Shield - VT012",
    serviceId: "-M98dWWIR1_8r1HWhzX3",
    status: "inactive",
    client: "Vodacom",
    vsBrand: "GVI-Brand",
    type: "API",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-10-18",
    lastUpdate: "2024-11-21",
  },
  {
    id: 46,
    name: "Zain Iraq | Old Click - ZQ013",
    serviceId: "-HTsVyrMFraAr5xgd3aF",
    status: "inactive",
    client: "Zain",
    vsBrand: "TrueMove",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-11-19",
    lastUpdate: "2024-12-22",
  },
  {
    id: 47,
    name: "GVI Services | sub-acc-archived",
    serviceId: "-Mrp-ojRvGH7jRbyGRBd",
    status: "inactive",
    client: "GVI",
    vsBrand: "Shield",
    type: "Redirect",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-12-20",
    lastUpdate: "2024-01-23",
  },
  {
    id: 48,
    name: "Asiacell | Basic Flow - AC014",
    serviceId: "-MRDKa7QKC3bT6WIXm7Z",
    status: "inactive",
    client: "Asiacell",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-21",
    lastUpdate: "2024-02-24",
  },
  {
    id: 49,
    name: "MTN Nigeria | Old Fraud - MT015",
    serviceId: "-MZpUTQV03h-GsiciJgH",
    status: "inactive",
    client: "MTN",
    vsBrand: "--",
    type: "DCB",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-22",
    lastUpdate: "2024-03-25",
  },
  {
    id: 50,
    name: "True Digital Group Co.,Ltd (4237) (4237) | Lucky Star Premium - 4237601 - True",
    serviceId: "KgyrZWLwVmXzOLudiG",
    status: "active",
    client: "True Digital",
    vsBrand: "Shield",
    type: "--",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-11",
    lastUpdate: "2024-03-13",
  },
  {
    id: 51,
    name: "True Digital Group Co.,Ltd (4239) (4239) | Wan Dee Gold - 4239710 - True",
    serviceId: "-iLCfo05pY1s6nMl-v",
    status: "active",
    client: "True Digital",
    vsBrand: "TrueMove",
    type: "--",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-14",
    lastUpdate: "2024-04-16",
  },
  {
    id: 52,
    name: "True Digital Group Co.,Ltd (4238) (4238) | Horo Pro Max - 4238800 - True",
    serviceId: "-N7ZZ-Df95vplKCb5Q",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-17",
    lastUpdate: "2024-05-19",
  },
  {
    id: 53,
    name: "GVI Services | sub-acc-platinum",
    serviceId: "qxdMEADAGq2wLu5kyG",
    status: "inactive",
    client: "GVI",
    vsBrand: "AIS-Brand",
    type: "--",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-20",
    lastUpdate: "2024-06-22",
  },
  {
    id: 54,
    name: "True Digital Group Co.,Ltd (4237) (4237) | Playit 5G - 4237700 - True",
    serviceId: "qlVjFq7B2Ft8Uk68Fa",
    status: "active",
    client: "True Digital",
    vsBrand: "MTN-Brand",
    type: "--",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-06-23",
    lastUpdate: "2024-07-25",
  },
  {
    id: 55,
    name: "Teleinfotech | Duang Den 3",
    serviceId: "-QJTay1-f4MCOajYP1",
    status: "active",
    client: "Teleinfotech",
    vsBrand: "--",
    type: "--",
    mno: "Safaricom-KE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-07-26",
    lastUpdate: "2024-08-28",
  },
  {
    id: 56,
    name: "True Digital Group Co.,Ltd (4239) (4239) | Health Care Plus - 4239600 - True",
    serviceId: "-Q7LiAHNTXGOgLXbsI",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "API",
    mno: "MTN-NG",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-08-01",
    lastUpdate: "2024-09-03",
  },
  {
    id: 57,
    name: "True Digital Group Co.,Ltd (4238) (4238) | XR Academy Pro - 4238200 - True",
    serviceId: "q459yq_gaTGAs3h2wL",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "Zain-SD",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-09-04",
    lastUpdate: "2024-10-06",
  },
  {
    id: 58,
    name: "Zain Iraq | Shield Elite - ZQ010",
    serviceId: "qNGIRYMxGm4241tM6Q",
    status: "active",
    client: "Zain",
    vsBrand: "TrueMove",
    type: "--",
    mno: "Orange-SN",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-10-07",
    lastUpdate: "2025-11-09",
  },
  {
    id: 59,
    name: "True Digital Group Co.,Ltd (4237) (4237) | Horo Sap5 - 4237800 - True",
    serviceId: "KMqR3FrT8KTxsVf3-Q",
    status: "active",
    client: "True Digital",
    vsBrand: "ZainBrand",
    type: "--",
    mno: "Vodacom-TZ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-11-10",
    lastUpdate: "2025-12-12",
  },
  {
    id: 60,
    name: "Asiacell | Click Guard Plus - AC020",
    serviceId: "-PnjhKpwsUfTiw8KoI",
    status: "active",
    client: "Asiacell",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-12-13",
    lastUpdate: "2025-01-15",
  },
  {
    id: 61,
    name: "True Digital Group Co.,Ltd (4239) (4239) | iPay Platinum - 4239620 - True",
    serviceId: "-HJvH_TkZ3IVLb5iX-",
    status: "active",
    client: "True Digital",
    vsBrand: "Shield",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-16",
    lastUpdate: "2024-02-18",
  },
  {
    id: 62,
    name: "MTN Nigeria | Fraud Shield - MT010",
    serviceId: "-E6UpTF8i7Pm93rF76",
    status: "inactive",
    client: "MTN",
    vsBrand: "TrueMove",
    type: "--",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-19",
    lastUpdate: "2024-03-21",
  },
  {
    id: 63,
    name: "Safaricom Kenya | Geo Shield Pro - SK020",
    serviceId: "-9-as4Uu4gEnhxpCzo",
    status: "active",
    client: "Safaricom",
    vsBrand: "--",
    type: "API",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-22",
    lastUpdate: "2024-04-24",
  },
  {
    id: 64,
    name: "True Digital Group Co.,Ltd (4238) (4238) | Lucky Star Ultra - 4238900 - True",
    serviceId: "qGCcfL32aRgjiWgWLk",
    status: "active",
    client: "True Digital",
    vsBrand: "AIS-Brand",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-25",
    lastUpdate: "2024-05-27",
  },
  {
    id: 65,
    name: "GVI Services | premium-sub-acc",
    serviceId: "KfXjsPqNmEFi4GqU6n",
    status: "active",
    client: "GVI",
    vsBrand: "MTN-Brand",
    type: "--",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-28",
    lastUpdate: "2024-06-28",
  },
  {
    id: 66,
    name: "Teleinfotech | Duang Den 4",
    serviceId: "-wSTvyxUaVwhRhrqEl",
    status: "active",
    client: "Teleinfotech",
    vsBrand: "--",
    type: "--",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-06-03",
    lastUpdate: "2024-07-05",
  },
  {
    id: 67,
    name: "Airtel Nigeria | Click Net - AN001",
    serviceId: "qGyis4nxMiur_WemeN",
    status: "active",
    client: "Airtel",
    vsBrand: "--",
    type: "--",
    mno: "Safaricom-KE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-07-06",
    lastUpdate: "2024-08-08",
  },
  {
    id: 68,
    name: "True Digital Group Co.,Ltd (4237) (4237) | Wan Dee Pro - 4237900 - True",
    serviceId: "-0GzpIATWoSUskrpI2",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "MTN-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-08-09",
    lastUpdate: "2024-09-11",
  },
  {
    id: 69,
    name: "Orange Senegal | Shield Basic - OS001",
    serviceId: "qp2wyJzqpjF8ijQUjB",
    status: "active",
    client: "Orange",
    vsBrand: "TrueMove",
    type: "--",
    mno: "Zain-SD",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-09-12",
    lastUpdate: "2024-10-14",
  },
  {
    id: 70,
    name: "True Digital Group Co.,Ltd (4239) (4239) | Health Care 4 - 4239700 - True",
    serviceId: "q9h-y37sCepxFvmZNQ",
    status: "active",
    client: "True Digital",
    vsBrand: "ZainBrand",
    type: "API",
    mno: "Orange-SN",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-10-15",
    lastUpdate: "2025-11-17",
  },
  {
    id: 71,
    name: "Vodacom Tanzania | Geo Track - VT001",
    serviceId: "-HUYUdWxxlR_t0K1G6",
    status: "inactive",
    client: "Vodacom",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "Vodacom-TZ",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-11-18",
    lastUpdate: "2025-12-20",
  },
  {
    id: 72,
    name: "True Digital Group Co.,Ltd (4238) (4238) | XR Plus Pro - 4238300 - True",
    serviceId: "-d7Y1XksA12iD7LNGW",
    status: "active",
    client: "True Digital",
    vsBrand: "Shield",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-12-21",
    lastUpdate: "2025-01-23",
  },
  {
    id: 73,
    name: "Zain Iraq | Lucky Net - ZQ020",
    serviceId: "KGuyG67-Z_gaY6UI1v",
    status: "active",
    client: "Zain",
    vsBrand: "TrueMove",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-24",
    lastUpdate: "2024-02-26",
  },
  {
    id: 74,
    name: "True Digital Group Co.,Ltd (4237) (4237) | Horo Sap6 - 4237950 - True",
    serviceId: "Kka3AN_Tcx5cMy5Fk8",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-27",
    lastUpdate: "2024-03-28",
  },
  {
    id: 75,
    name: "Ethio Telecom | Shield Pro - ET001",
    serviceId: "-Vyg05TIezfTffReTW",
    status: "active",
    client: "Ethio Telecom",
    vsBrand: "AIS-Brand",
    type: "--",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-02",
    lastUpdate: "2024-04-04",
  },
  {
    id: 76,
    name: "True Digital Group Co.,Ltd (4239) (4239) | Wan Dee Ultra - 4239800 - True",
    serviceId: "-IFl4UFK3BrjLEwbbp",
    status: "active",
    client: "True Digital",
    vsBrand: "MTN-Brand",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-05",
    lastUpdate: "2024-05-07",
  },
  {
    id: 77,
    name: "Sudatel | Click Guard - SD001",
    serviceId: "Kn856ZxiwlrnaoqzGR",
    status: "active",
    client: "Sudatel",
    vsBrand: "--",
    type: "API",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-08",
    lastUpdate: "2024-06-10",
  },
  {
    id: 78,
    name: "True Digital Group Co.,Ltd (4238) (4238) | Health Monitor - 4238400 - True",
    serviceId: "KtSvaxvTHVl7_ZD5Iq",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-06-11",
    lastUpdate: "2024-07-13",
  },
  {
    id: 79,
    name: "GVI Services | sub-acc-enterprise",
    serviceId: "-wVlsE4g4Gn9aT_3WO",
    status: "active",
    client: "GVI",
    vsBrand: "--",
    type: "--",
    mno: "Safaricom-KE",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-07-14",
    lastUpdate: "2024-08-16",
  },
  {
    id: 80,
    name: "Asiacell | Fraud Net Pro - AC030",
    serviceId: "KsRydjr4h2oYFZ-pFW",
    status: "inactive",
    client: "Asiacell",
    vsBrand: "TrueMove",
    type: "--",
    mno: "MTN-NG",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-08-17",
    lastUpdate: "2024-09-19",
  },
  {
    id: 81,
    name: "True Digital Group Co.,Ltd (4237) (4237) | Playit 4K - 4237980 - True",
    serviceId: "Kl_1p2CUxjTkc9LF3S",
    status: "active",
    client: "True Digital",
    vsBrand: "ZainBrand",
    type: "--",
    mno: "Zain-SD",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-09-20",
    lastUpdate: "2024-10-22",
  },
  {
    id: 82,
    name: "Teleinfotech | Duang Den 5",
    serviceId: "KetfgMTvWo4K2ETH_x",
    status: "active",
    client: "Teleinfotech",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "Orange-SN",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-10-23",
    lastUpdate: "2025-11-25",
  },
  {
    id: 83,
    name: "MTN Nigeria | Geo Shield - MT020",
    serviceId: "-p39Aec_3RQSjEFDxP",
    status: "active",
    client: "MTN",
    vsBrand: "Shield",
    type: "--",
    mno: "Vodacom-TZ",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-11-26",
    lastUpdate: "2025-12-28",
  },
  {
    id: 84,
    name: "True Digital Group Co.,Ltd (4239) (4239) | iPay Diamond - 4239900 - True",
    serviceId: "KjXmSPxBrYz8DYhrwf",
    status: "active",
    client: "True Digital",
    vsBrand: "TrueMove",
    type: "API",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-12-01",
    lastUpdate: "2025-01-03",
  },
  {
    id: 85,
    name: "Safaricom Kenya | Click Shield - SK030",
    serviceId: "KNSt4sTTXHU1mnRniT",
    status: "active",
    client: "Safaricom",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-04",
    lastUpdate: "2024-02-06",
  },
  {
    id: 86,
    name: "True Digital Group Co.,Ltd (4238) (4238) | Lucky Star Max - 4238500 - True",
    serviceId: "-zreBoJ4cSxk7srWEz",
    status: "active",
    client: "True Digital",
    vsBrand: "AIS-Brand",
    type: "--",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-07",
    lastUpdate: "2024-03-09",
  },
  {
    id: 87,
    name: "Airtel Nigeria | Shield Elite - AN010",
    serviceId: "-a19jINudwJzS3Vi8N",
    status: "active",
    client: "Airtel",
    vsBrand: "MTN-Brand",
    type: "--",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-10",
    lastUpdate: "2024-04-12",
  },
  {
    id: 88,
    name: "Zain Iraq | Health Net - ZQ030",
    serviceId: "qVNl2HZd28q6252jZZ",
    status: "active",
    client: "Zain",
    vsBrand: "--",
    type: "--",
    mno: "DTAC",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-04-13",
    lastUpdate: "2024-05-15",
  },
  {
    id: 89,
    name: "True Digital Group Co.,Ltd (4237) (4237) | Horo Sap7 - 4237990 - True",
    serviceId: "-FrI_4OE43vwNSBe2v",
    status: "inactive",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "AIS",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-05-16",
    lastUpdate: "2024-06-18",
  },
  {
    id: 90,
    name: "Orange Senegal | Traffic Guard - OS010",
    serviceId: "qtCt1SIB5kds1QCWdE",
    status: "active",
    client: "Orange",
    vsBrand: "--",
    type: "--",
    mno: "Airtel-NG",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-06-19",
    lastUpdate: "2024-07-21",
  },
  {
    id: 91,
    name: "True Digital Group Co.,Ltd (4239) (4239) | XR Academy 2 - 4239950 - True",
    serviceId: "Kck2O2CiK68YougtfW",
    status: "active",
    client: "True Digital",
    vsBrand: "TrueMove",
    type: "API",
    mno: "Safaricom-KE",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-07-22",
    lastUpdate: "2024-08-24",
  },
  {
    id: 92,
    name: "Vodacom Tanzania | Fraud Shield - VT010",
    serviceId: "q6XcLTfzvSz9aLMyJC",
    status: "active",
    client: "Vodacom",
    vsBrand: "ZainBrand",
    type: "--",
    mno: "MTN-NG",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-08-25",
    lastUpdate: "2024-09-27",
  },
  {
    id: 93,
    name: "True Digital Group Co.,Ltd (4238) (4238) | Wan Dee Gold - 4238600 - True",
    serviceId: "qUjGbbFpcEEhd2-qXI",
    status: "active",
    client: "True Digital",
    vsBrand: "GVI-Brand",
    type: "--",
    mno: "Zain-SD",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-09-28",
    lastUpdate: "2024-10-28",
  },
  {
    id: 94,
    name: "Ethio Telecom | Click Net Pro - ET010",
    serviceId: "-xWHeHlUwE1oSObwMm",
    status: "active",
    client: "Ethio Telecom",
    vsBrand: "Shield",
    type: "--",
    mno: "Orange-SN",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-10-03",
    lastUpdate: "2025-11-05",
  },
  {
    id: 95,
    name: "True Digital Group Co.,Ltd (4237) (4237) | iPay Service 2 - 4237995 - True",
    serviceId: "-W3DK1zrVc8oo3yqNW",
    status: "active",
    client: "True Digital",
    vsBrand: "TrueMove",
    type: "--",
    mno: "Vodacom-TZ",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-11-06",
    lastUpdate: "2025-12-08",
  },
  {
    id: 96,
    name: "Sudatel | Geo Pro - SD010",
    serviceId: "KtBb494j9pcy98_86T",
    status: "active",
    client: "Sudatel",
    vsBrand: "--",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standard",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2025-12-09",
    lastUpdate: "2025-01-11",
  },
  {
    id: 97,
    name: "True Digital Group Co.,Ltd (4239) (4239) | Horo Lucky 2 - 4239980 - True",
    serviceId: "-kp75cnQpQ7sm-RSa-",
    status: "active",
    client: "True Digital",
    vsBrand: "AIS-Brand",
    type: "--",
    mno: "--",
    carrierGradeNat: "--",
    shieldMode: "Standout",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-01-12",
    lastUpdate: "2024-02-14",
  },
  {
    id: 98,
    name: "GVI Services | sub-acc-global",
    serviceId: "qfl5yNWu1NV3t3sICg",
    status: "inactive",
    client: "GVI",
    vsBrand: "MTN-Brand",
    type: "API",
    mno: "Zain-IQ",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-02-15",
    lastUpdate: "2024-03-17",
  },
  {
    id: 99,
    name: "True Digital Group Co.,Ltd (4238) (4238) | Shield Core - 4238700 - True",
    serviceId: "KaiANM-AC5QhQV3OoE",
    status: "active",
    client: "True Digital",
    vsBrand: "--",
    type: "--",
    mno: "TRUE",
    carrierGradeNat: "--",
    shieldMode: "--",
    headerEnrichedFlow: "--",
    hePaymentFlow: "--",
    wifiPaymentFlow: "--",
    serviceCreated: "2024-03-18",
    lastUpdate: "2024-04-20",
  },
];

const PARTNER_ACTIONS = [
  { icon: "view", label: "View", color: "#17a2b8", iconOnly: true },
  { icon: "edit", label: "Edit", color: "#17a2b8", iconOnly: true },
  {
    icon: "settings",
    label: "Custom Variables",
    color: "#0d9488",
    iconOnly: false,
  },
];

const ADMIN_ACTIONS = [
  { group: "Service" },
  { label: "Solution", icon: "🔧", color: "#6c757d" },
  { label: "Map Service", icon: "🗺️", color: "#17a2b8" },
  { label: "Dashboard", icon: "📊", color: "#6c757d" },
  { divider: true },
  { group: "Management" },
  { label: "Edit", icon: "✏️", color: "#0d6efd" },
  { label: "IP", icon: "🌐", color: "#6c757d" },
  { label: "Clone Service", icon: "📋", color: "#0d9488" },
  { divider: true },
  { group: "Data" },
  { label: "Custom Variables", icon: "⚙️", color: "#0d9488" },
  { label: "Update Summary", icon: "📝", color: "#6c757d" },
];

function ActionsDropdown({ rowId, openRow, setOpenRow, onAction }) {
  const open = openRow === rowId;
  const btnRef = useRef(null);
  const dropRef = useRef(null);
  const [coords, setCoords] = useState(null);

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const flipUp = spaceBelow < 300;
      setCoords({
        top: flipUp ? null : rect.bottom + 4,
        bottom: flipUp ? window.innerHeight - rect.top + 4 : null,
        right: window.innerWidth - rect.right,
      });
    }
    setOpenRow(open ? null : rowId);
  }

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      const inBtn = btnRef.current && btnRef.current.contains(e.target);
      const inDrop = dropRef.current && dropRef.current.contains(e.target);
      if (!inBtn && !inDrop) setOpenRow(null);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpenRow(null);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpenRow]);

  const dropdown =
    open &&
    coords &&
    createPortal(
      <div
        ref={dropRef}
        className="svc-adm-dropdown"
        style={{
          position: "fixed",
          top: coords.top ?? "auto",
          bottom: coords.bottom ?? "auto",
          right: coords.right,
          zIndex: 99999,
        }}
      >
        {ADMIN_ACTIONS.map((a, i) => {
          if (a.divider) return <div key={i} className="svc-adm-divider" />;
          if (a.group)
            return (
              <div key={i} className="svc-adm-group">
                {a.group}
              </div>
            );
          return (
            <button
              key={a.label}
              onClick={() => {
                setOpenRow(null);
                onAction && onAction(a.key);
              }}
              className="svc-adm-item"
            >
              <span className="svc-adm-icon" style={{ "--c": a.color }}>
                {a.icon}
              </span>
              <span className="svc-adm-label" style={{ "--c": a.color }}>
                {a.label}
              </span>
            </button>
          );
        })}
      </div>,
      document.body,
    );

  return (
    <div className="svc-actions-wrap">
      <button ref={btnRef} onClick={handleToggle} className="svc-ver-btn">
        ···
      </button>
      {dropdown}
    </div>
  );
}

const PARTNER_ICONS = {
  view: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  edit: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  settings: (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

// ─── Shared modal shell ───────────────────────────────────────────────────────
function SvcModal({ title, subtitle, onClose, children, width = 560 }) {
  return (
    <div className="svc-modal-overlay" onClick={onClose}>
      <div
        className="svc-modal-box"
        style={{ maxWidth: width, width: "95vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="svc-modal-header">
          <div>
            <div className="svc-modal-title">{title}</div>
            {subtitle && <div className="svc-modal-subtitle">{subtitle}</div>}
          </div>
          <button className="svc-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="svc-modal-body">{children}</div>
      </div>
    </div>
  );
}

function SvcField({ label, value, mono }) {
  return (
    <div className="svc-modal-row">
      <span className="svc-modal-label">{label}</span>
      <span
        className={mono ? "svc-modal-value svc-val-mono" : "svc-modal-value"}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function SvcInput({ label, value, onChange, disabled, type = "text" }) {
  return (
    <div className="svc-form-field">
      <label className="svc-form-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={
          "svc-form-input" + (disabled ? " svc-form-input--disabled" : "")
        }
      />
    </div>
  );
}

// ─── Map Service Modal ────────────────────────────────────────────────────────
const VS_BRANDS_MOCK = [
  {
    group: "MCP VS",
    items: [
      "SMSTheSenseMA2 - 4242172",
      "Clip Cute - 827147664",
      "Asia Cute - 4584310",
    ],
  },
  {
    group: "TrueMove VS",
    items: ["TrueMove Pro - 1234567", "TrueMove Lite - 9876543"],
  },
  { group: "GVI VS", items: ["GVI Standard - 3312001", "GVI Plus - 3312002"] },
];
const TIMEZONES_LIST = [
  "Asia/Bangkok",
  "Asia/Singapore",
  "UTC",
  "Europe/London",
  "America/New_York",
  "Asia/Tokyo",
];
const COUNTRIES_LIST = [
  "Thailand (TH)",
  "Singapore (SG)",
  "United Kingdom (GB)",
  "United States (US)",
  "Japan (JP)",
  "Germany (DE)",
];

function MapServiceModal({ row, onClose }) {
  const [form, setForm] = useState({
    name: row?.name || "",
    companyName: row?.client || "",
    clientName: row?.client || "",
    timezone: "Asia/Bangkok",
    country: "Thailand (TH)",
    serviceUrl: `https://operator.shield.io/api/v1/gateway/${row?.id || ""}`,
  });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [approved, setApproved] = useState(null);

  const filtered = VS_BRANDS_MOCK.map((g) => ({
    ...g,
    items: g.items.filter((i) =>
      i.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((g) => g.items.length > 0);

  function toggleBrand(item) {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  }

  if (approved !== null) {
    return (
      <SvcModal title="Map Service" onClose={onClose} width={500}>
        <div className="svc-confirm-result">
          <div className="svc-confirm-icon">{approved ? "✅" : "❌"}</div>
          <div className="svc-confirm-title">
            {approved ? "Service Approved" : "Service Dis-Approved"}
          </div>
          <div className="svc-confirm-sub">
            <strong>{row?.name}</strong> has been{" "}
            {approved ? "approved and mapped" : "dis-approved"}.
          </div>
          <button className="svc-btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </SvcModal>
    );
  }

  return (
    <SvcModal
      title="Update Service"
      subtitle="Map and configure service settings"
      onClose={onClose}
      width={920}
    >
      <div className="svc-map-grid">
        <SvcInput
          label="Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <SvcInput
          label="Company Name"
          value={form.companyName}
          onChange={(e) =>
            setForm((f) => ({ ...f, companyName: e.target.value }))
          }
        />
        <SvcInput
          label="Client Name"
          value={form.clientName}
          onChange={(e) =>
            setForm((f) => ({ ...f, clientName: e.target.value }))
          }
        />
        <div className="svc-form-field">
          <label className="svc-form-label">Time Zone</label>
          <select
            className="svc-form-input svc-form-select"
            value={form.timezone}
            onChange={(e) =>
              setForm((f) => ({ ...f, timezone: e.target.value }))
            }
          >
            {TIMEZONES_LIST.map((tz) => (
              <option key={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <div className="svc-form-field">
          <label className="svc-form-label">Assigned Countries</label>
          <select
            className="svc-form-input svc-form-select"
            value={form.country}
            onChange={(e) =>
              setForm((f) => ({ ...f, country: e.target.value }))
            }
          >
            {COUNTRIES_LIST.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="svc-form-field">
          <label className="svc-form-label">Service URL</label>
          <div className="svc-url-row">
            <input
              value={form.serviceUrl}
              readOnly
              className="svc-form-input svc-form-input--disabled svc-url-input"
            />
            <button
              className="svc-url-copy"
              title="Copy URL"
              onClick={() => navigator.clipboard?.writeText(form.serviceUrl)}
            >
              📋
            </button>
          </div>
        </div>
      </div>

      <div className="svc-brands-section">
        <label className="svc-form-label">Vs Brands List</label>
        <div className="svc-brands-grid">
          <div className="svc-brands-left">
            <input
              className="svc-brands-search"
              placeholder="Search brands in list"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="svc-brands-list">
              {filtered.map((g) => (
                <div key={g.group}>
                  <div className="svc-brand-group">{g.group}</div>
                  {g.items.map((item) => (
                    <div
                      key={item}
                      className={
                        "svc-brand-item" +
                        (selected.includes(item) ? " selected" : "")
                      }
                      onClick={() => toggleBrand(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="svc-brands-empty">No brands found</div>
              )}
            </div>
          </div>
          <div className="svc-brands-right">
            {selected.length === 0 ? (
              <div className="svc-brands-empty">No brands selected</div>
            ) : (
              selected.map((item) => (
                <div key={item} className="svc-brand-selected">
                  <span>{item}</span>
                  <button
                    className="svc-brand-remove"
                    onClick={() => toggleBrand(item)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="svc-map-footer">
        <button className="svc-btn-approve" onClick={() => setApproved(true)}>
          Approve
        </button>
        <button
          className="svc-btn-disapprove"
          onClick={() => setApproved(false)}
        >
          Dis-Approve
        </button>
        <button className="svc-btn-reset" onClick={onClose}>
          Reset Mapping
        </button>
      </div>
    </SvcModal>
  );
}

// ─── Solution Modal ───────────────────────────────────────────────────────────
function SolutionModal({ row, onClose }) {
  const solutions = [
    "Shield Standard",
    "Shield Premium",
    "Fraud Detection",
    "Geo Resolver",
    "APK Vault",
  ];
  const [selected, setSelected] = useState(solutions[0]);
  return (
    <SvcModal
      title="Service Solution"
      subtitle={`Configure solution for ${row?.name}`}
      onClose={onClose}
      width={480}
    >
      <div className="svc-modal-row">
        <span className="svc-modal-label">Service</span>
        <span className="svc-modal-value">{row?.name}</span>
      </div>
      <div className="svc-modal-row">
        <span className="svc-modal-label">Service ID</span>
        <span className="svc-modal-value svc-val-mono">{row?.serviceId}</span>
      </div>
      <div className="svc-form-field" style={{ marginTop: 16 }}>
        <label className="svc-form-label">Solution Type</label>
        <select
          className="svc-form-input svc-form-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {solutions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="svc-modal-actions">
        <button className="svc-btn-primary" onClick={onClose}>
          Apply Solution
        </button>
        <button className="svc-btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </SvcModal>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditServiceModal({ row, onClose }) {
  const [form, setForm] = useState({
    name: row?.name || "",
    client: row?.client || "",
    type: row?.type || "",
    mno: row?.mno || "",
    shieldMode: row?.shieldMode || "",
  });
  const u = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <SvcModal
      title="Edit Service"
      subtitle="Update service configuration"
      onClose={onClose}
      width={640}
    >
      <div className="svc-map-grid">
        <SvcInput label="Service Name" value={form.name} onChange={u("name")} />
        <SvcInput label="Client" value={form.client} onChange={u("client")} />
        <SvcInput label="Service Type" value={form.type} onChange={u("type")} />
        <SvcInput label="MNO" value={form.mno} onChange={u("mno")} />
        <div className="svc-form-field">
          <label className="svc-form-label">Shield Mode</label>
          <select
            className="svc-form-input svc-form-select"
            value={form.shieldMode}
            onChange={u("shieldMode")}
          >
            {["--", "Standard", "Standout", "Premium"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
        <SvcInput label="Service ID" value={row?.serviceId || ""} disabled />
      </div>
      <div className="svc-modal-actions">
        <button className="svc-btn-primary" onClick={onClose}>
          Save Changes
        </button>
        <button className="svc-btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </SvcModal>
  );
}

// ─── IP Modal ─────────────────────────────────────────────────────────────────
function IpModal({ row, onClose }) {
  const [ips, setIps] = useState(["192.168.1.1", "10.0.0.1"]);
  const [newIp, setNewIp] = useState("");
  return (
    <SvcModal
      title="IP Whitelist"
      subtitle={`Manage allowed IPs for ${row?.client}`}
      onClose={onClose}
      width={480}
    >
      <div className="svc-ip-list">
        {ips.map((ip, i) => (
          <div key={i} className="svc-ip-row">
            <span className="svc-val-mono">{ip}</span>
            <button
              className="svc-ip-remove"
              onClick={() =>
                setIps((prev) => prev.filter((_, idx) => idx !== i))
              }
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="svc-ip-add">
        <input
          className="svc-form-input"
          placeholder="Enter IP address"
          value={newIp}
          onChange={(e) => setNewIp(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newIp.trim()) {
              setIps((p) => [...p, newIp.trim()]);
              setNewIp("");
            }
          }}
        />
        <button
          className="svc-btn-primary"
          onClick={() => {
            if (newIp.trim()) {
              setIps((p) => [...p, newIp.trim()]);
              setNewIp("");
            }
          }}
        >
          Add
        </button>
      </div>
      <div className="svc-modal-actions">
        <button className="svc-btn-primary" onClick={onClose}>
          Save
        </button>
        <button className="svc-btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </SvcModal>
  );
}

// ─── Clone Service Modal ──────────────────────────────────────────────────────
function CloneServiceModal({ row, onClose }) {
  const [cloneName, setCloneName] = useState(`${row?.name || ""} (Copy)`);
  const [done, setDone] = useState(false);
  if (done)
    return (
      <SvcModal title="Clone Service" onClose={onClose} width={440}>
        <div className="svc-confirm-result">
          <div className="svc-confirm-icon">✅</div>
          <div className="svc-confirm-title">Service Cloned</div>
          <div className="svc-confirm-sub">
            A copy of <strong>{row?.name}</strong> has been created as{" "}
            <strong>{cloneName}</strong>.
          </div>
          <button className="svc-btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </SvcModal>
    );
  return (
    <SvcModal
      title="Clone Service"
      subtitle="Create a duplicate of this service"
      onClose={onClose}
      width={480}
    >
      <SvcField label="Source Service" value={row?.name} />
      <SvcField label="Service ID" value={row?.serviceId} mono />
      <div className="svc-form-field" style={{ marginTop: 16 }}>
        <SvcInput
          label="New Service Name"
          value={cloneName}
          onChange={(e) => setCloneName(e.target.value)}
        />
      </div>
      <div className="svc-modal-actions">
        <button className="svc-btn-primary" onClick={() => setDone(true)}>
          Clone
        </button>
        <button className="svc-btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </SvcModal>
  );
}

// ─── Custom Variables Modal ───────────────────────────────────────────────────
function CustomVarsModal({ row, onClose }) {
  const [vars, setVars] = useState([
    { key: "CALLBACK_URL", value: "https://example.com/callback" },
    { key: "MAX_RETRY", value: "3" },
  ]);
  const [editIdx, setEditIdx] = useState(null);
  return (
    <SvcModal
      title="Custom Variables"
      subtitle={`Variables for ${row?.client}`}
      onClose={onClose}
      width={560}
    >
      <div className="svc-vars-list">
        {vars.map((v, i) => (
          <div key={i} className="svc-var-row">
            {editIdx === i ? (
              <>
                <input
                  className="svc-form-input svc-var-key"
                  value={v.key}
                  onChange={(e) =>
                    setVars((p) =>
                      p.map((x, j) =>
                        j === i ? { ...x, key: e.target.value } : x,
                      ),
                    )
                  }
                />
                <input
                  className="svc-form-input svc-var-val"
                  value={v.value}
                  onChange={(e) =>
                    setVars((p) =>
                      p.map((x, j) =>
                        j === i ? { ...x, value: e.target.value } : x,
                      ),
                    )
                  }
                />
                <button
                  className="svc-btn-primary svc-var-btn"
                  onClick={() => setEditIdx(null)}
                >
                  ✓
                </button>
              </>
            ) : (
              <>
                <span className="svc-var-key-lbl">{v.key}</span>
                <span className="svc-var-val-lbl">{v.value}</span>
                <button className="svc-var-edit" onClick={() => setEditIdx(i)}>
                  ✏️
                </button>
                <button
                  className="svc-var-del"
                  onClick={() => setVars((p) => p.filter((_, j) => j !== i))}
                >
                  🗑
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <button
        className="svc-var-add"
        onClick={() => {
          setVars((p) => [...p, { key: "NEW_VAR", value: "" }]);
          setEditIdx(vars.length);
        }}
      >
        + Add Variable
      </button>
      <div className="svc-modal-actions">
        <button className="svc-btn-primary" onClick={onClose}>
          Save
        </button>
        <button className="svc-btn-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </SvcModal>
  );
}

// ─── Update Summary Modal ─────────────────────────────────────────────────────
function UpdateSummaryModal({ row, onClose }) {
  const HISTORY = [
    {
      date: "2024-06-25",
      field: "Shield Mode",
      from: "Standard",
      to: "Premium",
      by: "admin@shield.io",
    },
    {
      date: "2024-05-10",
      field: "MNO",
      from: "--",
      to: "TRUE",
      by: "admin@shield.io",
    },
    {
      date: "2024-03-01",
      field: "Status",
      from: "inactive",
      to: "active",
      by: "system",
    },
  ];
  return (
    <SvcModal
      title="Update Summary"
      subtitle={`Change history for ${row?.name}`}
      onClose={onClose}
      width={640}
    >
      <div className="svc-history-list">
        {HISTORY.map((h, i) => (
          <div key={i} className="svc-history-row">
            <span className="svc-history-date">{h.date}</span>
            <span className="svc-history-field">{h.field}</span>
            <span className="svc-history-change">
              <span className="svc-history-from">{h.from}</span>
              <span className="svc-history-arrow">→</span>
              <span className="svc-history-to">{h.to}</span>
            </span>
            <span className="svc-history-by">{h.by}</span>
          </div>
        ))}
      </div>
      <div className="svc-modal-actions">
        <button className="svc-btn-cancel" onClick={onClose}>
          Close
        </button>
      </div>
    </SvcModal>
  );
}

function ServiceViewModal({ row, onClose }) {
  if (!row) return null;
  return (
    <div className="svc-modal-overlay" onClick={onClose}>
      <div className="svc-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="svc-modal-header">
          <span className="svc-modal-title">Service Details</span>
          <button className="svc-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="svc-modal-body">
          {[
            ["Name", row.name],
            ["Service ID", row.serviceId],
            ["Status", row.status],
            ["Client", row.client],
            ["Service Type", row.type || "--"],
            ["Shield Mode", row.shieldMode || "--"],
            ["Header Enriched Flow", row.headerEnrichedFlow || "--"],
            ["Last Update", row.lastUpdate],
            ["Service Created", row.serviceCreated],
          ].map(([label, value]) => (
            <div key={label} className="svc-modal-row">
              <span className="svc-modal-label">{label}</span>
              <span className="svc-modal-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PartnerActions({ row, setPage, setEditRow }) {
  function handleAction(actionLabel) {
    if (actionLabel === "View") {
      setEditRow({ mode: "view", row });
    } else if (actionLabel === "Edit") {
      setEditRow({ mode: "edit", row });
      if (setPage) setPage("onboarding");
    } else if (actionLabel === "Custom Variables") {
      setEditRow({ mode: "customVars", row });
    }
  }

  return (
    <div className="f-gap-4">
      {PARTNER_ACTIONS.map((a) => (
        <button
          key={a.label}
          title={a.label}
          className={a.iconOnly ? "svc-action-icon-btn" : "svc-action-badge"}
          style={{ "--c": a.color }}
          onClick={() => handleAction(a.label)}
        >
          {a.iconOnly ? (
            PARTNER_ICONS[a.icon]
          ) : (
            <>
              <span className="svc-action-btn-icon">
                {PARTNER_ICONS[a.icon]}
              </span>
              {a.label}
            </>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PageServices({ role = "admin", setPage }) {
  const [tab, setTab] = useState("active");
  const [perPageSvc, setPerPageSvc] = useState(10);
  const [openRow, setOpenRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [activeRow, setActiveRow] = useState(null);

  function openModal(key, row) {
    if (key === "dashboard" || key === "edit") {
      if (setPage) setPage("overview", row);
      return;
    }
    setActiveModal(key);
    setActiveRow(row);
  }
  function closeModal() {
    setActiveModal(null);
    setActiveRow(null);
  }

  const isPartner = role === "partner";
  const isAdmin = role === "admin";

  const activeServices = svcRows.filter((r) => r.status === "active");
  const inactiveServices = svcRows.filter((r) => r.status !== "active");
  const displayed = tab === "active" ? activeServices : inactiveServices;
  const visibleServices = displayed.slice(0, perPageSvc);

  const SUMMARY_STATS = [
    { label: "Total Services", value: svcRows.length, color: "#2563eb" },
    { label: "Active", value: activeServices.length, color: "#22c55e" },
    { label: "Inactive", value: inactiveServices.length, color: "#f50b1f" },
  ];

  const ALL_COLUMNS = [
    { key: "sr", label: "Sr.", admin: true, partner: true },
    { key: "name", label: "Name", admin: true, partner: true },
    { key: "serviceId", label: "Service ID", admin: true, partner: true },
    { key: "status", label: "Status", admin: true, partner: true },
    { key: "client", label: "Client", admin: true, partner: false },
    { key: "vsBrand", label: "VS Brand", admin: true, partner: false },
    { key: "serviceType", label: "Service Type", admin: true, partner: true },
    { key: "mno", label: "MNO", admin: true, partner: false },
    {
      key: "carrierGradeNat",
      label: "Carrier Grade NAT",
      admin: true,
      partner: false,
    },
    { key: "shieldMode", label: "ShieldMode", admin: true, partner: true },
    {
      key: "headerEnrichedFlow",
      label: "Header Enriched Flow",
      admin: true,
      partner: true,
    },
    {
      key: "hePaymentFlow",
      label: "HE Payment Flow",
      admin: true,
      partner: false,
    },
    {
      key: "wifiPaymentFlow",
      label: "WiFi Payment Flow",
      admin: true,
      partner: false,
    },
    {
      key: "serviceCreated",
      label: "Service Created",
      admin: true,
      partner: false,
    },
    { key: "lastUpdate", label: "Last Update", admin: true, partner: true },
    { key: "actions", label: "Actions", admin: true, partner: true },
  ];

  const visibleCols = ALL_COLUMNS.filter((c) =>
    isAdmin ? c.admin : c.partner,
  );

  function renderCell(col, row, idx) {
    switch (col.key) {
      case "sr":
        return <span className="txt-muted">{idx + 1}</span>;
      case "name":
        return (
          <div className="text-flow" title={row.name}>
            <span className="txt-label-md">{row.name}</span>
          </div>
        );
      case "serviceId":
        return (
          <div className="text-flow" title={row.serviceId}>
            <span className="txt-mono">{row.serviceId}</span>
          </div>
        );
      case "status":
        return (
          <span
            className="svc-status-badge"
            style={{ "--c": row.status === "active" ? "#16a34a" : "#f59e0b" }}
          >
            {row.status.toUpperCase()}
          </span>
        );
      case "client":
        return <span className="txt-body">{row.client || "--"}</span>;
      case "vsBrand":
        return <span className="svc-dash">{row.vsBrand || "--"}</span>;
      case "serviceType":
        return <span className="svc-dash">{row.type || "--"}</span>;
      case "mno":
        return <span className="svc-dash">{row.mno || "--"}</span>;
      case "carrierGradeNat":
        return <span className="svc-dash">{row.carrierGradeNat || "--"}</span>;
      case "shieldMode":
        return row.shieldMode && row.shieldMode !== "--" ? (
          <span className="svc-pill">{row.shieldMode}</span>
        ) : (
          <span className="txt-muted">--</span>
        );
      case "headerEnrichedFlow":
        return (
          <span className="svc-dash">{row.headerEnrichedFlow || "--"}</span>
        );
      case "hePaymentFlow":
        return <span className="svc-dash">{row.hePaymentFlow || "--"}</span>;
      case "wifiPaymentFlow":
        return <span className="svc-dash">{row.wifiPaymentFlow || "--"}</span>;
      case "serviceCreated":
        return <span className="svc-code">{row.serviceCreated}</span>;
      case "lastUpdate":
        return <span className="svc-code">{row.lastUpdate}</span>;
      case "actions":
        return isAdmin ? (
          <ActionsDropdown
            rowId={row.id}
            openRow={openRow}
            setOpenRow={setOpenRow}
            onAction={(key) => openModal(key, row)}
          />
        ) : (
          <PartnerActions row={row} setPage={setPage} setEditRow={setEditRow} />
        );
      default:
        return "--";
    }
  }

  function handleModalClose() {
    setEditRow(null);
  }

  return (
    <div>
      {editRow?.mode === "view" && (
        <ServiceViewModal row={editRow.row} onClose={handleModalClose} />
      )}
      {activeModal === "mapService" && (
        <MapServiceModal row={activeRow} onClose={closeModal} />
      )}
      {activeModal === "solution" && (
        <SolutionModal row={activeRow} onClose={closeModal} />
      )}
      {activeModal === "edit" && (
        <EditServiceModal row={activeRow} onClose={closeModal} />
      )}
      {activeModal === "ip" && <IpModal row={activeRow} onClose={closeModal} />}
      {activeModal === "cloneService" && (
        <CloneServiceModal row={activeRow} onClose={closeModal} />
      )}
      {activeModal === "customVars" && (
        <CustomVarsModal row={activeRow} onClose={closeModal} />
      )}
      {activeModal === "updateSummary" && (
        <UpdateSummaryModal row={activeRow} onClose={closeModal} />
      )}
      {/* Summary stats */}
      <div className="g-stats3 mb-section">
        {SUMMARY_STATS.map(({ label, value, color }) => (
          <Card key={label} className="stat-top-4" style={{ "--c": color }}>
            <div className="kpi-stat dyn-color" style={{ "--c": color }}>
              {value}
            </div>
            <div className="stat-sublabel">{label}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="g-split2 mb-section">
        <Card>
          <SectionTitle>Uptime Trend (14 days)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={repTrend}>
              <XAxis dataKey="d" />
              <YAxis />
              <Tooltip />
              <Line
                dataKey="visits"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionTitle>API Calls by Service</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={API_CALL_DATA}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
                {API_CALL_DATA.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Service Registry */}
      <Card>
        <div className="svc-toolbar">
          <div className="svc-toolbar-left">
            <SectionTitle>Service Registration</SectionTitle>
            <div className="dt-entries-bar">
              <span className="dt-entries-lbl">Show</span>
              <select
                className="dt-entries-sel"
                value={perPageSvc}
                onChange={(e) => setPerPageSvc(Number(e.target.value))}
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <span className="dt-entries-lbl">entries</span>
            </div>
            {isPartner && (
              <button
                onClick={() => setPage && setPage("onboarding")}
                className="svc-add-btn"
                style={{ "--c": T }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                ⊕ Add New Service
              </button>
            )}
          </div>

          <div className="svc-toolbar-right">
            {[
              ["active", "22c55e", "dcfce7", "16a34a"],
              ["inactive", "f59e0b", "fef3c7", "d97706"],
            ].map(([key, dotHex, bgHex, textHex]) => {
              const isOn = tab === key;
              const count =
                key === "active"
                  ? activeServices.length
                  : inactiveServices.length;
              const label = key === "active" ? "✓ Active" : "⊘ Inactive";
              return (
                <button
                  key={key}
                  onClick={() => {
                    setPerPageSvc(25);
                    setTab(key);
                  }}
                  className={`svc-tab-btn ${isOn ? "on" : "off"}`}
                  style={{ "--c": `#${textHex}` }}
                >
                  <span
                    className={`svc-tab-dot ${isOn ? "on" : "off"}`}
                    style={{ "--c": `#${dotHex}` }}
                  />
                  {label}
                  <span
                    className={`svc-tab-pill ${isOn ? "on" : "off"}`}
                    style={{ "--bg": `#${bgHex}`, "--c": `#${textHex}` }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="svc-tbl-wrap">
          <table className="svc-tbl">
            <colgroup>
              {visibleCols.map((col) => {
                const colClassMap = {
                  sr: "svc-col-sr",
                  name: "svc-col-name",
                  serviceId: "svc-col-id",
                  status: "svc-col-status",
                  client: "svc-col-client",
                  vsBrand: "svc-col-vsbrand",
                  serviceType: "svc-col-type",
                  mno: "svc-col-mno",
                  carrierGradeNat: "svc-col-cgnat",
                  shieldMode: "svc-col-shield",
                  headerEnrichedFlow: "svc-col-hef",
                  hePaymentFlow: "svc-col-hepay",
                  wifiPaymentFlow: "svc-col-wifipay",
                  serviceCreated: "svc-col-created",
                  lastUpdate: "svc-col-updated",
                  actions: "svc-col-actions",
                };
                return (
                  <col key={col.key} className={colClassMap[col.key] || ""} />
                );
              })}
            </colgroup>
            <thead>
              <tr>
                {visibleCols.map((col) => (
                  <th key={col.key} className="dt-th">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={visibleCols.length} className="dt-empty">
                    No {tab} services found.
                  </td>
                </tr>
              ) : (
                visibleServices.map((row, idx) => (
                  <tr key={idx}>
                    {visibleCols.map((col) => (
                      <td
                        key={col.key}
                        className={
                          col.key === "sr"
                            ? "svc-td-sr"
                            : col.key === "actions"
                              ? "svc-td-actions"
                              : ""
                        }
                      >
                        {renderCell(col, row, idx)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
