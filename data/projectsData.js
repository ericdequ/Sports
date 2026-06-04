// Generated from packages/blog-kit/src/projects.js. Run "node scripts/blogs.mjs sync-projects" after editing the global catalog.
const projectsData = [
  {
    "key": "robot-ric",
    "title": "Robot Ric",
    "description": "My Book Series about a robot who learns about the world and humanity",
    "url": "https://robotric.org/",
    "imgSrc": "https://robotric.org/lp.webp",
    "category": "story",
    "tags": [
      "robotric",
      "books",
      "story"
    ],
    "ecosystemGroups": [
      "robotric",
      "story-geography",
      "education"
    ],
    "mapRequests": [
      {
        "id": "robotric-story-places",
        "datasetId": "robotric:story-places",
        "label": "Story place anchors",
        "status": "requested",
        "relation": "requests",
        "groups": [
          "robotric",
          "story-geography",
          "education"
        ],
        "features": [
          "api-request-needed",
          "story-place-grounding",
          "tst-records",
          "future-map-layer"
        ],
        "reason": "Create a reusable story/location API so Robotric stories can ground places, realms, lessons, and map embeds.",
        "dataset": {
          "id": "robotric:story-places",
          "title": "Robotric Story Places",
          "blog": "",
          "mapPath": "",
          "endpoint": "",
          "status": "requested",
          "provider": "Robotric story/location API requested",
          "source": "Future story, project, and worldbuilding place anchors",
          "groups": [
            "robotric",
            "story-geography",
            "education"
          ],
          "features": [
            "api-request-needed",
            "story-place-grounding",
            "tst-records"
          ]
        },
        "datasetTitle": "Robotric Story Places",
        "endpoint": "",
        "blog": "",
        "mapPath": "",
        "mapUrl": ""
      }
    ]
  },
  {
    "key": "quantum-learning",
    "title": "Quantum Learning",
    "description": "A learning platform for students to learn about quantum computing and Other Computer Science topics",
    "url": "https://www.robotric.org/Classroom/",
    "imgSrc": "https://www.quantumcybersolutions.com/entanglement.webp",
    "category": "education",
    "tags": [
      "learning",
      "quantum",
      "computer-science"
    ],
    "ecosystemGroups": [
      "education",
      "tst",
      "interactive-lessons"
    ]
  },
  {
    "key": "bev",
    "title": "Bev",
    "description": "A Bar Discovery App that helps you find the perfect Place To drink with Friends!",
    "url": "https://www.bev.cool",
    "imgSrc": "https://www.bev.cool/BEV.svg",
    "category": "app",
    "tags": [
      "bars",
      "local-discovery",
      "social"
    ],
    "ecosystemGroups": [
      "bev",
      "local-discovery",
      "social-places"
    ],
    "mapRequests": [
      {
        "id": "bev-venue-pois",
        "datasetId": "bev:venue-pois",
        "label": "Venue POI API",
        "status": "requested",
        "relation": "requests",
        "groups": [
          "bev",
          "local-discovery",
          "social-places"
        ],
        "features": [
          "api-request-needed",
          "venue-clustering",
          "place-reviews",
          "safe-social-routing",
          "reviews",
          "rss-place-feed"
        ],
        "reason": "Create the canonical venue/place API that BEV and the blogs can reuse for nightlife, local discovery, and social place posts.",
        "dataset": {
          "id": "bev:venue-pois",
          "title": "BEV Venue POIs",
          "blog": "",
          "mapPath": "",
          "endpoint": "",
          "status": "requested",
          "provider": "BEV + OpenStreetMap venue provider requested",
          "source": "Future bar, nightlife, restaurant, and local social venue data",
          "groups": [
            "bev",
            "local-discovery",
            "social-places"
          ],
          "features": [
            "api-request-needed",
            "venue-clustering",
            "place-reviews",
            "safe-social-routing"
          ]
        },
        "datasetTitle": "BEV Venue POIs",
        "endpoint": "",
        "blog": "",
        "mapPath": "",
        "mapUrl": ""
      }
    ]
  },
  {
    "key": "legelet",
    "title": "Legelet",
    "description": "A platform that connects legal professionals with clients seeking legal services, providing a seamless experience for both parties.",
    "url": "https://www.leopiolet.com/",
    "imgSrc": "https://www.leopiolet.com/TTP.png",
    "category": "legal",
    "tags": [
      "legal",
      "marketplace",
      "services"
    ]
  },
  {
    "key": "ballru",
    "title": "Ballru",
    "description": "An application that connects atheletes with trainers, recuits coaches for local programs",
    "url": "https://robotric.org/",
    "imgSrc": "https://www.quantumcybersolutions.com/entanglement.webp",
    "category": "sports",
    "tags": [
      "athletes",
      "trainers",
      "coaching"
    ],
    "ecosystemGroups": [
      "sports",
      "coaching",
      "local-discovery"
    ],
    "mapRequests": [
      {
        "id": "ballru-fields-courts",
        "datasetId": "sports:fields-courts",
        "label": "Fields and courts",
        "status": "active",
        "relation": "uses",
        "groups": [
          "sports",
          "local-discovery",
          "community-events",
          "coaching"
        ],
        "features": [
          "live-bbox-api",
          "venue-search",
          "surface-filtering",
          "pickup-readiness",
          "coach-place-matching"
        ],
        "reason": "Match athletes, trainers, and coaches to real local fields and courts.",
        "dataset": {
          "id": "sports:fields-courts",
          "title": "Pickup Fields And Courts",
          "blog": "sports",
          "mapPath": "/map",
          "endpoint": "/api/map/fields",
          "status": "active",
          "provider": "OpenStreetMap Overpass",
          "source": "OSM sports fields and courts with BEV map-lab seed fixtures",
          "groups": [
            "sports",
            "local-discovery",
            "community-events"
          ],
          "features": [
            "live-bbox-api",
            "venue-search",
            "surface-filtering",
            "pickup-readiness"
          ]
        },
        "datasetTitle": "Pickup Fields And Courts",
        "endpoint": "/api/map/fields",
        "blog": "sports",
        "mapPath": "/map",
        "mapUrl": "https://www.sportstips.org/map"
      }
    ]
  },
  {
    "key": "kinetic-gyms",
    "title": "Kinetic Gyms",
    "description": "The Idea That the work down in the gym can be converted to energy or electricity, imagine if your energy bill was running high, and you could go to a gym and work off steam, and bills.",
    "url": "https://robotric.org/",
    "imgSrc": "https://www.quantumcybersolutions.com/entanglement.webp",
    "category": "sports",
    "tags": [
      "fitness",
      "energy",
      "gym"
    ],
    "ecosystemGroups": [
      "sports",
      "fitness",
      "energy"
    ],
    "mapRequests": [
      {
        "id": "kinetic-gyms-venue-data",
        "datasetId": "sports:fields-courts",
        "label": "Fitness venue data",
        "status": "planned",
        "relation": "extends",
        "groups": [
          "sports",
          "local-discovery",
          "community-events",
          "fitness",
          "energy"
        ],
        "features": [
          "live-bbox-api",
          "venue-search",
          "surface-filtering",
          "pickup-readiness",
          "energy-site-metadata",
          "future-gym-layer"
        ],
        "reason": "Extend the sports map contract toward gyms and energy-producing fitness locations.",
        "dataset": {
          "id": "sports:fields-courts",
          "title": "Pickup Fields And Courts",
          "blog": "sports",
          "mapPath": "/map",
          "endpoint": "/api/map/fields",
          "status": "active",
          "provider": "OpenStreetMap Overpass",
          "source": "OSM sports fields and courts with BEV map-lab seed fixtures",
          "groups": [
            "sports",
            "local-discovery",
            "community-events"
          ],
          "features": [
            "live-bbox-api",
            "venue-search",
            "surface-filtering",
            "pickup-readiness"
          ]
        },
        "datasetTitle": "Pickup Fields And Courts",
        "endpoint": "/api/map/fields",
        "blog": "sports",
        "mapPath": "/map",
        "mapUrl": "https://www.sportstips.org/map"
      }
    ]
  },
  {
    "key": "pickup",
    "title": "pickup",
    "description": "An application that tracks teams for pickup games forms tournaments, and brackets so your team doesnt get skipped waiting to get on the court.",
    "url": "https://robotric.org/",
    "imgSrc": "https://www.quantumcybersolutions.com/entanglement.webp",
    "category": "sports",
    "tags": [
      "pickup-games",
      "tournaments",
      "teams"
    ],
    "ecosystemGroups": [
      "sports",
      "pickup-games",
      "community-events"
    ],
    "mapRequests": [
      {
        "id": "pickup-fields-courts",
        "datasetId": "sports:fields-courts",
        "label": "Pickup field finder",
        "status": "active",
        "relation": "uses",
        "groups": [
          "sports",
          "local-discovery",
          "community-events",
          "pickup-games"
        ],
        "features": [
          "live-bbox-api",
          "venue-search",
          "surface-filtering",
          "pickup-readiness",
          "team-queue",
          "event-place-grounding"
        ],
        "reason": "Use field and court POIs as the place backbone for pickup games, teams, and tournaments.",
        "dataset": {
          "id": "sports:fields-courts",
          "title": "Pickup Fields And Courts",
          "blog": "sports",
          "mapPath": "/map",
          "endpoint": "/api/map/fields",
          "status": "active",
          "provider": "OpenStreetMap Overpass",
          "source": "OSM sports fields and courts with BEV map-lab seed fixtures",
          "groups": [
            "sports",
            "local-discovery",
            "community-events"
          ],
          "features": [
            "live-bbox-api",
            "venue-search",
            "surface-filtering",
            "pickup-readiness"
          ]
        },
        "datasetTitle": "Pickup Fields And Courts",
        "endpoint": "/api/map/fields",
        "blog": "sports",
        "mapPath": "/map",
        "mapUrl": "https://www.sportstips.org/map"
      }
    ]
  },
  {
    "key": "ochoview",
    "title": "OchoView",
    "description": "A platform that allows anyone to commentate games and makes it super easy to switch commentators, allowing for local people, college students get experience commentating sports games, like a stream ",
    "url": "https://robotric.org/",
    "imgSrc": "https://rikara.vercel.app/2.webp",
    "category": "sports",
    "tags": [
      "commentary",
      "streaming",
      "sports"
    ],
    "ecosystemGroups": [
      "sports",
      "streaming",
      "local-media"
    ],
    "mapRequests": [
      {
        "id": "ochoview-venue-broadcasts",
        "datasetId": "sports:fields-courts",
        "label": "Game venue anchors",
        "status": "planned",
        "relation": "extends",
        "groups": [
          "sports",
          "local-discovery",
          "community-events",
          "streaming",
          "local-media"
        ],
        "features": [
          "live-bbox-api",
          "venue-search",
          "surface-filtering",
          "pickup-readiness",
          "venue-context",
          "broadcast-place-feed",
          "commentator-clusters"
        ],
        "reason": "Anchor local game streams and commentator opportunities to real sports places.",
        "dataset": {
          "id": "sports:fields-courts",
          "title": "Pickup Fields And Courts",
          "blog": "sports",
          "mapPath": "/map",
          "endpoint": "/api/map/fields",
          "status": "active",
          "provider": "OpenStreetMap Overpass",
          "source": "OSM sports fields and courts with BEV map-lab seed fixtures",
          "groups": [
            "sports",
            "local-discovery",
            "community-events"
          ],
          "features": [
            "live-bbox-api",
            "venue-search",
            "surface-filtering",
            "pickup-readiness"
          ]
        },
        "datasetTitle": "Pickup Fields And Courts",
        "endpoint": "/api/map/fields",
        "blog": "sports",
        "mapPath": "/map",
        "mapUrl": "https://www.sportstips.org/map"
      }
    ]
  }
]

export default projectsData
