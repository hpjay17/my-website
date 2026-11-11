// Content for beyond.html. Section headings, nav and the hero line are in the HTML; everything else is here.
const beyondData = {
    interests: [
        {
            name: "Duolingo",
            icon: "./images/beyond/duolingo.jpeg",
            note: "Currently learning Japanese w/ 830-day streak",
            link: "https://www.duolingo.com/",
        },
        {
            name: "GeoGuessr",
            icon: "",
            note: "Exploring the world virtually one street at a time",
            link: "https://www.geoguessr.com/",
        },
        {
            name: "Tennis & Pickleball",
            icon: "",
            note: "You only live once, but you get to serve twice",
            link: "https://www.atptour.com/en",
        },
        {
            name: "Fishing",
            icon: "",
            note: "If I'm not fishing, I'm thinking about it",
            link: "https://myfwc.com/fishing/",
        },
    ],

    aviation: {
        headline: "Private Pilot",
        license: "Private Pilot License (PPL)",
        summary:
            "Earned my Private Pilot License at 17. Flying gives me a unique perspective on the world ~ from above.",
        // Shown as tiles under the summary
        logbook: [
            { label: "Total Flight Hours", value: 90.5 },
            { label: "Pilot in Command", value: 29.9 },
            { label: "Landings", value: 221 },
            { label: "Airports", value: 14 },
        ],
        aircraftFlown: [
            { name: "Piper PA-28 Cherokee", note: "Primary trainer" },
            { name: "Cessna 172 Skyhawk", note: "Secondary trainer" },
        ],
        milestones: [
            {
                label: "First Solo",
                date: "September 2022",
                description: "First time flying alone",
            },
            {
                label: "PPL Checkride",
                date: "March 2023",
                description: "Passed the FAA practical exam",
            },
        ],
        goals: [
            "Instrument Rating",
            "Commercial Pilot License",
            "Take my family flying",
        ],
        photos: [
            { src: "./images/beyond/aviation1.jpeg", alt: "Cockpit" },
            { src: "./images/beyond/plane.jpeg", alt: "Piper Cherokee" },
        ],
    },

    // Always on the map, in their own color. Not counted in the places stat.
    home: [
        {
            place: "Tallahassee, Florida",
            coords: [30.438, -84.281],
            date: "Hometown",
        },
        {
            place: "Atlanta, Georgia",
            coords: [33.749, -84.388],
            date: "School",
        },
    ],

    // One card and map pin per trip, in date order.
    // place: "City, Country", or "City, State" in the US. The pin label uses the city; the country stat uses the part after the last comma.
    // coords: [lat, lng] (right-click a spot in Google Maps to copy). Omit to show the card without a pin.
    // image: a photo in images/beyond/, or "" for a card without one. Shrink new photos first:
    //   sips -Z 1600 -s format jpeg -s formatOptions low images/beyond/NAME.jpeg
    // Then add the flights to and from it in `routes`.
    travel: [
        {
            place: "San José, Costa Rica",
            coords: [9.935, -84.088],
            date: "June 2023",
            image: "./images/beyond/costarica.jpeg",
            note: "Horseback riding on the beaches",
        },
        {
            place: "Dubai, UAE",
            coords: [25.205, 55.271],
            date: "July 2023",
            image: "./images/beyond/dubai.jpeg",
            note: "Went to the top of the Burj Khalifa",
        },
        {
            place: "Tokyo, Japan",
            coords: [35.716, 139.800],
            date: "June 2024",
            image: "./images/beyond/tokyo_japan.jpeg",
            note: "Visited the Senso-Ji in Tokyo",
        },
        {
            place: "Nara, Japan",
            coords: [34.685, 135.843],
            date: "June 2024",
            image: "./images/beyond/nara_japan.jpeg",
            note: "Explored Nara Park with the sika deer",
        },
        {
            place: "Shanghai, China",
            coords: [31.240, 121.496],
            date: "March 2025",
            image: "./images/beyond/shanghai_china.jpeg",
            note: "Traveled to my hometown for spring break",
        },
        {
            place: "Reykjavík, Iceland",
            coords: [64.146, -21.942],
            date: "August 2025",
            image: "./images/beyond/iceland1.jpg",
            note: "Explored the nature in Iceland",
        },
        {
            place: "Ann Arbor, Michigan",
            coords: [42.277, -83.737],
            date: "December 2025",
            image: "./images/beyond/michigan.jpg",
            note: "Went for the Blockchain Conference",
        },
        {
            place: "Lisbon, Portugal",
            coords: [38.710, -9.137],
            date: "January 2026",
            image: "./images/beyond/lisbon1.jpeg",
            note: "Had fun in Lisbon for winter break",
        },
        {
            place: "Denver, Colorado",
            coords: [39.739, -104.990],
            date: "February 2026",
            image: "./images/beyond/denver.jpeg",
            note: "Attended ETHDenver",
        },
        {
            place: "Hong Kong, China",
            coords: [22.319, 114.169],
            date: "July 2026",
            image: "./images/beyond/hongkong1.jpeg",
            note: "Went to Hong Kong after summer internship",
        },
        {
            place: "Fukuoka, Japan",
            coords: [33.590, 130.401],
            date: "August 2026",
            image: "./images/beyond/fukuoka1.jpeg",
            note: "Traveled to Fukuoka after visiting Shanghai",
        },
    ],

    // Map-only places (layovers, places without photos): a small pin and no card. date is optional and shows in the tooltip.
    // Counted in the places and countries stats, and usable in routes.
    stops: [
        { place: "New York, New York", coords: [40.713, -74.006], date: "Family" },
        { place: "Baltimore, Maryland", coords: [39.290, -76.612], date: "Naval Academy" },
        { place: "Detroit, Michigan", coords: [42.331, -83.046], date: "Layover" },
        { place: "Seoul, South Korea", coords: [37.567, 126.978], date: "Layover" },
        { place: "Dallas, Texas", coords: [32.777, -96.797], date: "Layover" },
        { place: "Seattle, Washington", coords: [47.606, -122.332], date: "Layover" },
        { place: "Jacksonville, Florida", coords: [30.332, -81.656], date: "Layover" },
        { place: "Orlando, Florida", coords: [28.538, -81.379], date: "Layover" },
        { place: "Los Angeles, California", coords: [34.052, -118.244], date: "Layover" },
    ],

    // Flights in the order taken, which is the order the replay flies them: ["From place", "To place"], using exact place names.
    // Every flight adds to the miles stat. A third value counts a repeated flight: ["Tallahassee, Florida", "Atlanta, Georgia", 6].
    // A return leg shares the outbound line on the map.
    // A year on its own line ("2024",) starts that year in the replay; trips reached in their own year show their date.
    routes: [
        "2023",
        ["Tallahassee, Florida", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "San José, Costa Rica"],
        ["San José, Costa Rica", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "Tallahassee, Florida"],
        ["Tallahassee, Florida", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "New York, New York"],
        ["New York, New York", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "Tallahassee, Florida"],
        ["Tallahassee, Florida", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "Baltimore, Maryland"],
        ["Baltimore, Maryland", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "Tallahassee, Florida"],
        ["Orlando, Florida", "Dubai, UAE"],
        ["Dubai, UAE", "Shanghai, China"],
        ["Shanghai, China", "Dubai, UAE"],
        ["Dubai, UAE", "Orlando, Florida"],

        "2024",
        ["Tallahassee, Florida", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "Detroit, Michigan"],
        ["Detroit, Michigan", "Tokyo, Japan"],
        ["Nara, Japan", "Shanghai, China"],
        ["Shanghai, China", "Seoul, South Korea"],
        ["Seoul, South Korea", "Dallas, Texas"],
        ["Dallas, Texas", "Tallahassee, Florida"],
        ["Tallahassee, Florida", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "Tallahassee, Florida"],

        "2025",
        ["Atlanta, Georgia", "Seattle, Washington"],
        ["Seattle, Washington", "Shanghai, China"],
        ["Shanghai, China", "Seattle, Washington"],
        ["Seattle, Washington", "Atlanta, Georgia"],
        ["Jacksonville, Florida", "New York, New York"],
        ["New York, New York", "Jacksonville, Florida"],
        ["Orlando, Florida", "Reykjavík, Iceland"],
        ["Reykjavík, Iceland", "Orlando, Florida"],
        ["Atlanta, Georgia", "Ann Arbor, Michigan"],
        ["Ann Arbor, Michigan", "Atlanta, Georgia"],

        "2026",
        ["Atlanta, Georgia", "New York, New York"],
        ["New York, New York", "Lisbon, Portugal"],
        ["Lisbon, Portugal", "New York, New York"],
        ["New York, New York", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "Denver, Colorado"],
        ["Denver, Colorado", "Atlanta, Georgia"],
        ["Atlanta, Georgia", "Los Angeles, California"],
        ["Los Angeles, California", "Hong Kong, China"],
        ["Hong Kong, China", "Shanghai, China"],
        ["Shanghai, China", "Fukuoka, Japan"],
        ["Tokyo, Japan", "Atlanta, Georgia"],
    ],

    // Each distinct category gets a filter button
    gallery: [
        {
            src: "./images/beyond/gallery/flying.jpg",
            alt: "Piloting",
            category: "aviation",
        },
        {
            src: "./images/beyond/gallery/iceland2.jpg",
            alt: "Reynisfjara Beach",
            category: "travel",
        },
        {
            src: "./images/beyond/gallery/iceland3.JPG",
            alt: "Reykjavik Sunset",
            category: "travel",
        },
        {
            src: "./images/beyond/gallery/lisbon3.jpg",
            alt: "The Moorish Castle",
            category: "travel",
        },
        {
            src: "./images/beyond/gallery/lisbon2.jpeg",
            alt: "Boca do Inferno",
            category: "travel",
        },
    ],

    // Intro screen (js/gate.js): a boarding pass in the blue theme, a terminal login in the green one
    gate: {
        boardingPass: {
            airline: "JAY AIR",
            from: { code: "OFC", city: "Office" },
            to: { code: "BYD", city: "Beyond Work" },
            // Shown in a 3-column grid; "Date" is filled in with today's date
            fields: [
                ["Passenger", "GUEST"],
                ["Flight", "JW 017"],
                ["Date", "TODAY"],
                ["Gate", "B12"],
                ["Seat", "27A"],
                ["Boards", "NOW"],
            ],
            stub: "Seat 27A · Gate B12",
            button: "Scan boarding pass",
            buttonDone: "Boarding ✓",
            hint: "Press Enter to board",
            hintTouch: "Tap the button to board",
        },
        terminal: {
            title: "guest@jaywang: ~",
            // Each line: `text` appears at once, then `type` is typed out after it.
            // Optional: speed (ms per typed letter), pause (ms before the line), highlight: true (green block).
            // {time} becomes the current date and time.
            lines: [
                { text: "Last login: {time} on ttys001" },
                { text: "jaywang.dev :: restricted area /beyond" },
                { text: "" },
                { text: "login: ", type: "guest" },
                { text: "password: ", type: "********" },
                { text: "Verifying credentials", type: "...", speed: 250 },
                { text: "ACCESS GRANTED", highlight: true, pause: 500 },
                { text: "Welcome, guest. Loading /beyond", type: " ...", speed: 120 },
            ],
            hint: "Press any key or click to skip",
            hintTouch: "Tap to skip",
        },
    },
};
