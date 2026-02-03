const express = require("express");
const app = express();
const {ObjectId} = require('mongodb')
const mongoose = require('mongoose');
const User = require("./models/user");
const Request = require("./models/request");
const Comment = require("./models/comment");
const Reply = require('./models/reply')
require('dotenv').config()
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true})
    .then(()=> console.log('DB Connected!!'))
    .catch(err=> console.error(err))

    const db = mongoose.connection;


const collection = db.collection('requests')


data = [{
        _id: ObjectId('647a3c230e32043824952da1'),
        id: 1,
        title: "Add tags for solutions",
        category: "enhancement",
        upvotes: 112,
        status: "suggestion",
        description: "Easier to search for solutions based on a specific stack.",
        comments: [{
               _id: ObjectId('647a3c230e32043824952ca1'),
                id: 1,
                content: "Awesome idea! Trying to find framework-specific projects within the hubs can be tedious",
                user: {
                    _id: ObjectId('647a3c230e32043824952da3'),
                    image: "/assets/user-images/image-suzanne.jpg",
                    name: "Suzanne Chang",
                    username: "upbeat1811"
                }
            },
            {
                _id: ObjectId('647a3c230e32043824952ca2'),
                id: 2,
                content: "Please use fun, color-coded labels to easily identify them at a glance",
                user: {
                    _id: ObjectId('647a3c230e32043824952ea1'),
                    image: "/assets/user-images/image-thomas.jpg",
                    name: "Thomas Hood",
                    username: "brawnybrave"
                }
            }
        ]
    },
    {
        _id: ObjectId('647a3c230e32043824952da2'),
        id: 2,
        title: "Add a dark theme option",
        category: "feature",
        upvotes: 99,
        status: "suggestion",
        description: "It would help people with light sensitivities and who prefer dark mode.",
        comments: [{
                _id: ObjectId('647a3c230e32043824952ca3'),
                id: 3,
                content: "Also, please allow styles to be applied based on system preferences. I would love to be able to browse Frontend Mentor in the evening after my device’s dark mode turns on without the bright background it currently has.",
                user: {
                    _id: ObjectId('647a3c230e32043824952ea2'),
                    image: "/assets/user-images/image-elijah.jpg",
                    name: "Elijah Moss",
                    username: "hexagon.bestagon"
                }
            },
            {
                _id: ObjectId('647a3c230e32043824952ca4'),
                id: 4,
                content: "Second this! I do a lot of late night coding and reading. Adding a dark theme can be great for preventing eye strain and the headaches that result. It’s also quite a trend with modern apps and  apparently saves battery life.",
                user: {
                    _id: ObjectId('647a3c230e32043824952ea3'),
                    image: "/assets/user-images/image-james.jpg",
                    name: "James Skinner",
                    username: "hummingbird1"
                },
                replies: [{
                        _id: ObjectId('647a3c230e32043824952da1'),
                        content: "While waiting for dark mode, there are browser extensions that will also do the job. Search for 'dark theme' followed by your browser. There might be a need to turn off the extension for sites with naturally black backgrounds though.",
                        replyingTo: "hummingbird1",
                        user: {
                            _id: ObjectId('647a3c230e32043824952ea4'),
                            image: "/assets/user-images/image-anne.jpg",
                            name: "Anne Valentine",
                            username: "annev1990"
                        }
                    },
                    {
                        _id: ObjectId('647a3c230e32043824952da2'),
                        content: "Good point! Using any kind of style extension is great and can be highly customizable, like the ability to change contrast and brightness. I'd prefer not to use one of such extensions, however, for security and privacy reasons.",
                        replyingTo: "annev1990",
                        user: {
                            _id: ObjectId('647a3c230e32043824952ea5'),
                            image: "/assets/user-images/image-ryan.jpg",
                            name: "Ryan Welles",
                            username: "voyager.344",
                        }
                    }
                ]
            }
        ]
    },
    {
        _id: ObjectId('647a3c230e32043824952da3'),
        id: 3,
        title: "Q&A within the challenge hubs",
        category: "feature",
        upvotes: 65,
        status: "suggestion",
        description: "Challenge-specific Q&A would make for easy reference.",
        comments: [{
            _id: ObjectId('647a3c230e32043824952fa5'),
            id: 5,
            content: "Much easier to get answers from devs who can relate, since they've either finished the challenge themselves or are in the middle of it.",
            user: {
                _id: ObjectId('647a3c230e32043824952ea6'),
                image: "/assets/user-images/image-george.jpg",
                name: "George Partridge",
                username: "soccerviewer8"
            }
        }]
    },
    {
        _id: ObjectId('647a3c230e32043824952da4'),
        id: 4,
        title: "Add image/video upload to feedback",
        category: "enhancement",
        upvotes: 51,
        status: "suggestion",
        description: "Images and screencasts can enhance comments on solutions.",
        comments: [{
                _id: ObjectId('647a3c230e32043824952ca6'),
                id: 6,
                content: "Right now, there is no ability to add images while giving feedback which isn't ideal because I have to use another app to show what I mean",
                user: {
                    _id: ObjectId('647a3c230e32043824952ea7'),
                    image: "/assets/user-images/image-javier.jpg",
                    name: "Javier Pollard",
                    username: "warlikeduke"
                }
            },
            {
                _id: ObjectId('647a3c230e32043824952da2'),
                id: 7,
                content: "Yes I'd like to see this as well. Sometimes I want to add a short video or gif to explain the site's behavior..",
                user: {
                    _id: ObjectId('647a3c230e32043824952ea8'),
                    image: "/assets/user-images/image-roxanne.jpg",
                    name: "Roxanne Travis",
                    username: "peppersprime32"
                }
            }
        ]
    },
    {
        _id: ObjectId('647a3c230e32043824952da5'),
        id: 5,
        title: "Ability to follow others",
        category: "feature",
        upvotes: 42,
        status: "suggestion",
        description: "Stay updated on comments and solutions other people post.",
        comments: [{
                _id: ObjectId('647a3c230e32043824952ca7'),
                id: 8,
                content: "I also want to be notified when devs I follow submit projects on FEM. Is in-app notification also in the pipeline?",
                user: {
                    _id: ObjectId('647a3c230e32043824952ea9'),
                    image: "/assets/user-images/image-victoria.jpg",
                    name: "Victoria Mejia",
                    username: "arlen_the_marlin"
                },
                replies: [{
                    _id: ObjectId('647a3c230e32043824952da1'),
                    content: "Bumping this. It would be good to have a tab with a feed of people I follow so it's easy to see what challenges they’ve done lately. I learn a lot by reading good developers' code.",
                    replyingTo: "arlen_the_marlin",
                    user: {
                        _id: ObjectId('647a3c230e32043824952fa1'),
                        image: "/assets/user-images/image-zena.jpg",
                        name: "Zena Kelley",
                        username: "velvetround"
                    }
                }]
            },
            {
                _id: ObjectId('647a3c230e32043824952da2'),
                id: 9,
                content: "I've been saving the profile URLs of a few people and I check what they’ve been doing from time to time. Being able to follow them solves that",
                user: {
                    _id: ObjectId('647a3c230e32043824952fa2'),
                    image: "/assets/user-images/image-jackson.jpg",
                    name: "Jackson Barker",
                    username: "countryspirit"
                }
            }
        ]
    },
    {
        _id: ObjectId('647a3c230e32043824952da6'),
        id: 6,
        title: "Preview images not loading",
        category: "bug",
        upvotes: 3,
        status: "suggestion",
        description: "Challenge preview images are missing when you apply a filter."
    },
    {
       _id: ObjectId('647a3c230e32043824952da7'),
        id: 7,
        title: "More comprehensive reports",
        category: "feature",
        upvotes: 123,
        status: "planned",
        description: "It would be great to see a more detailed breakdown of solutions.",
        comments: [{
                _id: ObjectId('647a3c230e32043824952ca8'),
                id: 10,
                content: "This would be awesome! It would be so helpful to see an overview of my code in a way that makes it easy to spot where things could be improved.",
                user: {
                    _id: ObjectId('647a3c230e32043824952fa3'),
                    image: "/assets/user-images/image-victoria.jpg",
                    name: "Victoria Mejia",
                    username: "arlen_the_marlin"
                }
            },
            {
                _id: ObjectId('647a3c230e32043824952ca9'),
                id: 11,
                content: "Yeah, this would be really good. I'd love to see deeper insights into my code!",
                user: {
                    _id: ObjectId('647a3c230e32043824952fa4'),
                    image: "/assets/user-images/image-jackson.jpg",
                    name: "Jackson Barker",
                    username: "countryspirit"
                }
            }
        ]
    },
    {
        _id: ObjectId('647a3c230e32043824952da8'),
        id: 8,
        title: "Learning paths",
        category: "feature",
        upvotes: 28,
        status: "planned",
        description: "Sequenced projects for different goals to help people improve.",
        comments: [{
            _id: ObjectId('647a3c230e32043824952da1'),
            id: 12,
            content: "Having a path through the challenges that I could follow would be brilliant! Sometimes I'm not sure which challenge would be the best next step to take. So this would help me navigate through them!",
            user: {
                _id: ObjectId('647a3c230e32043824952fa5'),
                image: "/assets/user-images/image-george.jpg",
                name: "George Partridge",
                username: "soccerviewer8"
            }
        }]
    },
    {
        _id: ObjectId('647a3c230e32043824952da9'),
        id: 9,
        title: "One-click portfolio generation",
        category: "feature",
        upvotes: 62,
        status: "in-progress",
        description: "Add ability to create professional looking portfolio from profile.",
        comments: [{
            _id: ObjectId('647a3c230e32043824952da2'),
            id: 13,
            content: "I haven't built a portfolio site yet, so this would be really helpful. Might it also be possible to choose layout and colour themes?!",
            user: {
                _id: ObjectId('647a3c230e32043824952fa6'),
                image: "/assets/user-images/image-ryan.jpg",
                name: "Ryan Welles",
                username: "voyager.344"
            }
        }]
    },
    {
        _id: ObjectId('647a3c230e32043824952db1'),
        id: 10,
        title: "Bookmark challenges",
        category: "feature",
        upvotes: 31,
        status: "in-progress",
        description: "Be able to bookmark challenges to take later on.",
        comments: [{
            _id: ObjectId('647a3c230e32043824952da3'),
            id: 14,
            content: "This would be great! At the moment, I'm just starting challenges in order to save them. But this means the My Challenges section is overflowing with projects and is hard to manage. Being able to bookmark challenges would be really helpful.",
            user: {
                _id: ObjectId('647a3c230e32043824952fa7'),
                image: "/assets/user-images/image-suzanne.jpg",
                name: "Suzanne Chang",
                username: "upbeat1811"
            }
        }]
    },
    {
        _id: ObjectId('647a3c230e32043824952db2'),
        id: 11,
        title: "Animated solution screenshots",
        category: "bug",
        upvotes: 9,
        status: "in-progress",
        description: "Screenshots of solutions with animations don’t display correctly."
    },
    {
        _id: ObjectId('647a3c230e32043824952db3'),
        id: 12,
        title: "Add micro-interactions",
        category: "enhancement",
        upvotes: 71,
        status: "live",
        description: "Small animations at specific points can add delight.",
        comments: [{
            _id: ObjectId('647a3c230e32043824952da4'),
            id: 15,
            content: "I'd love to see this! It always makes me so happy to see little details like these on websites.",
            user: {
                _id: ObjectId('647a3c230e32043824952fa8'),
                image: "/assets/user-images/image-victoria.jpg",
                name: "Victoria Mejia",
                username: "arlen_the_marlin"
            },
            replies: [{
                _id: ObjectId('647a3c230e32043824952da1'),
                content: "Me too! I'd also love to see celebrations at specific points as well. It would help people take a moment to celebrate their achievements!",
                replyingTo: "arlen_the_marlin",
                user: {
                    _id: ObjectId('647a3c230e32043824952fa9'),
                    image: "/assets/user-images/image-suzanne.jpg",
                    name: "Suzanne Chang",
                    username: "upbeat1811"
                }
            }]
        }]
    }
]

  // Insert the data into the collection
  collection.insertMany(data, function(err, result) {
    if (err) {
      console.error('Error inserting data:', err);
    } else {
      console.log(`${result.insertedCount} documents inserted successfully`);
    }

    // Close the connection
    // client.close();
  });

