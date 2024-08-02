import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEnvelope,
    faGift,
    faHome,
    faMoneyBill,
    faPieChart,
    faShop,
    faSubscript,
} from "@fortawesome/free-solid-svg-icons";
import { getFormattedMessage } from "../shared/sharedMethod";

export default [
    {
        title: "dashboard.title",
        name: "dashboard",
        fontIcon: <FontAwesomeIcon icon={faPieChart} />,
        to: "/admin/dashboard",
        class: "d-flex",
        items: [
            {
                title: "Dashboard",
                to: "/admin/dashboard",
            },
        ],
    },
    {
        title: "Packages.title",
        name: "Packages.title",
        fontIcon: <FontAwesomeIcon icon={faGift} />,
        to: "/admin/packages",
        class: "d-flex",
        items: [
            {
                title: "Packages",
                to: "/admin/packages",
            },
        ],
    },
    {
        title: "Stores",
        name: "Stores",
        fontIcon: <FontAwesomeIcon icon={faShop} />,
        to: "/admin/stores",
        class: "d-flex",
        items: [
            {
                title: "Stores",
                to: "/admin/stores",
            },
        ],
    },
    {
        title: "Transactions",
        name: "Transactions",
        fontIcon: <FontAwesomeIcon icon={faMoneyBill} />,
        to: "/admin/transactions",
        class: "d-flex",
        items: [
            {
                title: "Transactions",
                to: "/admin/transactions",
            },
        ],
    },
    {
        title: "Enquiries",
        name: "enquiries",
        fontIcon: <FontAwesomeIcon icon={faEnvelope} />,
        to: "/admin/enquiries",
        class: "d-flex",
        items: [
            {
                title: "Enquiries",
                to: "/admin/enquiries",
            },
        ],
    },
];

